from django.core.files.storage import storages


def public_storage():
    return storages['public']

def private_storage():
    return storages['private']
