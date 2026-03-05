from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from app.filters import TodoFilter
from app.models import Project, Tag, Todo
from app.permissions import IsOwner
from app.serializers import ProjectSerializer, TagSerializer, TodoSerializer


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TagViewSet(ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class TodoViewSet(ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TodoFilter

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]

        if project.user != self.request.user:
            raise PermissionDenied(
                "You cannot create a TODO in a project that you do not own."
            )

        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        project = serializer.validated_data.get("project", self.get_object().project)

        if project.user != self.request.user:
            raise PermissionDenied(
                "You cannot move TODO to project that you do not own."
            )

        serializer.save()
