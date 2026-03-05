from django.contrib import admin

from app.models import Tag, Project, Todo


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "user")
    search_fields = ("name",)
    ordering = ("name",)
    list_filter = ("user",)


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "project", "status", "created_at")
    search_fields = ("name",)
    list_filter = ("user", "project", "status")
    ordering = ("title", "created_at", "status")
