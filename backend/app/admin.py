from django.contrib import admin
from .models import Product, Party, Invoice, InvoiceItem, Payment, PaymentAllocation

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'product_name', 'price', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('product_name',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    autocomplete_fields = ('created_by',)

@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ('id', 'party_name', 'mobile_number', 'email_address', 'current_balance', 'created_at')
    list_filter = ('city', 'state', 'created_at')
    search_fields = ('party_name', 'mobile_number', 'email_address', 'gst_number', 'pan_number')
    ordering = ('party_name',)
    readonly_fields = ('created_at',)
    autocomplete_fields = ('created_by',)

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'party', 'invoice_date', 'grand_total', 'received_amount', 'pending_amount', 'status', 'created_at')
    list_filter = ('status', 'invoice_date', 'created_at')
    search_fields = ('invoice_number', 'party__party_name', 'party__mobile_number')
    date_hierarchy = 'invoice_date'
    autocomplete_fields = ('party', 'created_by')
    inlines = [InvoiceItemInline]
    list_select_related = ('party', 'created_by')
    readonly_fields = ('created_at',)

class PaymentAllocationInline(admin.TabularInline):
    model = PaymentAllocation
    extra = 0

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'party', 'amount_received', 'payment_mode', 'reference_number', 'payment_date', 'created_at')
    list_filter = ('payment_mode', 'payment_date', 'created_at')
    search_fields = ('party__party_name', 'reference_number')
    autocomplete_fields = ('party', 'created_by')
    inlines = [PaymentAllocationInline]
    list_select_related = ('party', 'created_by')
    readonly_fields = ('created_at',)

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'invoice', 'product', 'product_name_snapshot', 'quantity', 'price', 'amount')
    search_fields = ('invoice__invoice_number', 'product_name_snapshot')
    list_select_related = ('invoice', 'product')

@admin.register(PaymentAllocation)
class PaymentAllocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'payment', 'invoice', 'allocated_amount')
    search_fields = ('invoice__invoice_number', 'payment__party__party_name')
    list_select_related = ('payment', 'invoice')
