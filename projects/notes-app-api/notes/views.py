from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "content"]

    def get_queryset(self):
        queryset = Note.objects.filter(owner=self.request.user)
        tag = self.request.query_params.get("tag")
        if tag:
            queryset = queryset.filter(tags__contains=tag)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
