import logging
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Party, Invoice
from .party_serializers import PartySerializer

logger = logging.getLogger(__name__)

class PartyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PartySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['party_name', 'mobile_number']
    ordering_fields = ['party_name', 'current_balance', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Party.objects.select_related('created_by').all()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)
        logger.info(f"Party '{serializer.validated_data.get('party_name')}' created by {user}")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if Invoice.objects.filter(party=instance).exists():
            logger.warning(f"Prevented deletion of party ID {instance.id} associated with existing invoices.")
            return Response(
                {"detail": "Cannot delete party because it has associated invoices. Archive or reassign them first."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        logger.info(f"Party ID {instance.id} successfully deleted by {request.user}")
        return Response(status=status.HTTP_204_NO_CONTENT)
