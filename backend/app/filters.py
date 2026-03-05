import django_filters

from app.models import Todo


class TodoFilter(django_filters.FilterSet):
    class Meta:
        model = Todo
        fields = ["project", "status", "due_date"]
