import { useState } from "react";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { SideModal } from "@/components/ui/SideModal";
import { useUser } from "@/contexts/UserContext";
import { useModalParams } from "@/hooks/useModalParams";
import { customerService } from "@/services";
import { cn } from "@/utils";

const SUPPORT_TOPICS = [
  { value: "order_enquiry", label: "Order Enquiry" },
  { value: "general_support", label: "General Support" },
  { value: "delivery_issue", label: "Delivery Issue" },
  { value: "order_mismatch", label: "Order Mismatch or Wrong Item Received" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "product_care", label: "Product Care Question" },
  { value: "returns_refunds", label: "Returns and Refunds" },
];

const emptyForm = {
  topic: "general_support",
  message: "",
  guest_full_name: "",
  guest_email: "",
  guest_phone: "",
};

const fieldClass =
  "w-full rounded-2xl bg-hero-sage/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-hero-muted focus:bg-hero-sage/60";

export function SupportModal() {
  const { isSupportOpen, closeModal } = useModalParams();
  const { isAuthenticated, user } = useUser();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        topic: form.topic,
        message: form.message.trim(),
      };

      if (!isAuthenticated) {
        payload.guest_full_name = form.guest_full_name.trim();
        payload.guest_email = form.guest_email.trim();
        payload.guest_phone = form.guest_phone.trim();
      }

      await customerService.createSupportRequest(payload);
      setForm(emptyForm);
      setMessage("Support request submitted successfully");
      window.setTimeout(() => {
        closeModal();
        setMessage("");
      }, 1200);
    } catch (nextError) {
      setError(nextError.message || "Unable to submit your support request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SideModal isOpen={isSupportOpen} onClose={closeModal} title="Contact Support">
      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
        {isAuthenticated && (
          <div className="bg-hero-sage/25 px-4 py-3">
            <p className="text-sm font-medium text-hero-dark">
              {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                user?.email}
            </p>
            <p className="mt-1 text-xs font-light text-hero-muted">{user?.email}</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="grid gap-3">
            <input
              value={form.guest_full_name}
              onChange={(event) => setForm({ ...form, guest_full_name: event.target.value })}
              required
              placeholder="Full name"
              className={fieldClass}
            />
            <input
              value={form.guest_email}
              onChange={(event) => setForm({ ...form, guest_email: event.target.value })}
              required
              type="email"
              placeholder="Email address"
              className={fieldClass}
            />
            <input
              value={form.guest_phone}
              onChange={(event) => setForm({ ...form, guest_phone: event.target.value })}
              required
              inputMode="tel"
              placeholder="Phone number"
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <p className="mb-1 text-sm font-light text-hero-muted">Topic</p>
          <SelectDropdown
            value={form.topic}
            options={SUPPORT_TOPICS}
            onChange={(topic) => setForm({ ...form, topic })}
          />
        </div>

        <label className="block text-sm font-light text-hero-muted">
          Message
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
            rows={6}
            placeholder="Tell us what happened or what you need help with."
            className={cn(fieldClass, "mt-1 resize-none")}
          />
        </label>

        {(message || error) && (
          <p
            className={cn(
              "px-4 py-3 text-sm font-light",
              error ? "bg-red-50 text-red-700" : "bg-hero-sage/45 text-hero-dark",
            )}
          >
            {error || message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full bg-hero-green px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send to support"}
        </button>
      </form>
    </SideModal>
  );
}
