from rest_framework import serializers
from .models import Party

class PartySerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username', default=None)

    class Meta:
        model = Party
        fields = [
            'id',
            'party_name',
            'mobile_number',
            'alternate_mobile',
            'email_address',
            'gst_number',
            'pan_number',
            'address_line_1',
            'address_line_2',
            'landmark',
            'city',
            'state',
            'pincode',
            'country',
            'current_balance',
            'created_by',
            'created_by_username',
            'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at', 'current_balance']

    def validate_party_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError("Party name cannot be empty.")
        
        query = Party.objects.filter(party_name__iexact=name)
        if self.instance:
            query = query.exclude(pk=self.instance.pk)
        
        if query.exists():
            raise serializers.ValidationError("Party with this name already exists.")
        
        return name

    def validate_mobile_number(self, value):
        phone = value.strip()
        if not phone:
            raise serializers.ValidationError("Mobile number cannot be empty.")
        return phone
