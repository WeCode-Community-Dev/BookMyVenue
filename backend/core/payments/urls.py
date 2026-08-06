from django.urls import path

from payments.views import OwnerTransactionListView, PaymentVerifyView

urlpatterns = [
    path("verify/", PaymentVerifyView.as_view(), name="payment-verify"),
    path(
        "transactions/",
        OwnerTransactionListView.as_view(),
        name="owner-transactions",
    ),
]
