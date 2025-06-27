"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["SERVICE_BOOKING"] = "service_booking";
    NotificationType["TICKET_BOOKING"] = "ticket_booking";
    NotificationType["CANCEL_SERVICE_BOOKING"] = "cancel_service_booking";
    NotificationType["CANCEL_TICKET_BOOKING"] = "cancel_ticket_booking";
    NotificationType["CHAT_MESSAGE"] = "chat_message";
    NotificationType["RESCHEDULE_SERVICE_BOOKING"] = "reschedule_service_booking";
    NotificationType["BOOKIG_ADVANCE_PAYMENT"] = "booking_advance_payment";
    NotificationType["BOOKING_REJECTED"] = "booking_rejected";
    NotificationType["BOOKING_APPROVED"] = "booking_approved";
    NotificationType["BOOKING_COMPLETED"] = "booking_completed";
    NotificationType["BOOKING_CANCELLED"] = "booking_cancelled";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=notification.js.map