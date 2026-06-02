from rest_framework import serializers

from .models import Resume
from .validators import validate_resume_file


class ResumeSerializer(serializers.ModelSerializer):
    file_size_display = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = (
            'id',
            'original_filename',
            'file',
            'file_size',
            'file_size_display',
            'file_url',
            'uploaded_at',
        )
        read_only_fields = ('id', 'original_filename', 'file_size', 'uploaded_at')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate_file(self, value):
        validate_resume_file(value)
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        file = validated_data['file']
        return Resume.objects.create(
            user=user,
            file=file,
            original_filename=file.name,
            file_size=file.size,
        )


class ResumeListSerializer(serializers.ModelSerializer):
    file_size_display = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    has_parsed_data = serializers.SerializerMethodField()
    has_analysis = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = (
            'id',
            'original_filename',
            'file_size',
            'file_size_display',
            'file_url',
            'uploaded_at',
            'has_parsed_data',
            'has_analysis',
        )

    def get_has_parsed_data(self, obj):
        return bool(obj.parsed_data)

    def get_has_analysis(self, obj):
        return bool(obj.analysis_data)

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
