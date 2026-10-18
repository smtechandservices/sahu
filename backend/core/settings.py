import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'unsafe-default-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')
CSRF_TRUSTED_ORIGINS = [o for o in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',') if o]

# Behind nginx: trust its X-Forwarded-Proto so Django knows requests are HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',

    # Local apps
    'api',
    'core',
]

AUTH_USER_MODEL = 'api.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

CORS_ALLOW_ALL_ORIGINS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

import dj_database_url

if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

STATIC_ROOT = os.getenv('STATIC_ROOT', os.path.join(BASE_DIR, 'staticfiles'))

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# File storage. With AWS_STORAGE_BUCKET_NAME set, uploads go to S3:
#   public/  -> gallery + magazine files, plain cacheable URLs (needs a bucket
#               policy allowing s3:GetObject on public/*)
#   private/ -> matrimonial photos, short-lived signed URLs
# Credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in the env, or
# the instance's IAM role. Without a bucket, files are written to MEDIA_ROOT.
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')

if AWS_STORAGE_BUCKET_NAME:
    _region = os.getenv('AWS_S3_REGION_NAME', 'ap-southeast-2')
    _s3 = {
        'bucket_name': AWS_STORAGE_BUCKET_NAME,
        'region_name': _region,
        'endpoint_url': f'https://s3.{_region}.amazonaws.com',
        'addressing_style': 'virtual',
        'signature_version': 's3v4',
        'custom_domain': os.getenv('AWS_S3_CUSTOM_DOMAIN') or None,
        'file_overwrite': False,
        'default_acl': None,
    }
    _private = {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            **_s3,
            'custom_domain': None,  # signed URLs must hit S3 directly
            'location': 'private',
            'querystring_auth': True,
            'querystring_expire': int(os.getenv('AWS_QUERYSTRING_EXPIRE', '3600')),
        },
    }
    _public = {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            **_s3,
            'location': 'public',
            'querystring_auth': False,
            'object_parameters': {'CacheControl': 'public, max-age=31536000, immutable'},
        },
    }
else:
    _private = _public = {'BACKEND': 'django.core.files.storage.FileSystemStorage'}

STORAGES = {
    'default': _private,
    'public': _public,
    'private': _private,
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Magazine article PDF uploads (stored as BinaryField)
MAX_ARTICLE_PDF_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

# Allow request bodies up to 14 MB to support video uploads in the media gallery
DATA_UPLOAD_MAX_MEMORY_SIZE = 14 * 1024 * 1024  # 14 MB

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.authentication.CustomJWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
