import { APP_NAME } from "@/constants";

const UPDATED_AT = "November 13, 2026";
const CONTACT_PHONE = "+233 50 133 39";
const CONTACT_WHATSAPP = "https://wa.me/2335013339";

function PolicyShell({ eyebrow, title, intro, children }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-4 sm:pb-6">
      <section className="bg-white px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-hero-dark sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-light leading-7 text-hero-muted">
          {intro}
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
          Last updated: {UPDATED_AT}
        </p>
      </section>

      <section className="space-y-4 bg-white px-5 py-6 sm:px-8">
        {children}
      </section>
    </div>
  );
}

function PolicySection({ title, children }) {
  return (
    <div className="border-b border-hero-sage/40 pb-5 last:border-b-0 last:pb-0">
      <h2 className="font-serif text-2xl text-hero-dark">{title}</h2>
      <div className="mt-3 space-y-3 text-sm font-light leading-7 text-hero-muted">
        {children}
      </div>
    </div>
  );
}

function PolicyList({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TermsAndConditionsPage() {
  return (
    <PolicyShell
      eyebrow="Store terms"
      title="Terms & Conditions"
      intro={`These terms govern purchases, payments, delivery, refunds, and use of ${APP_NAME}. By placing an order, you confirm that you have read and accepted these terms, the Refund Policy, and the Privacy Policy.`}
    >
      <PolicySection title="Store Information">
        <p>
          {APP_NAME} sells electronics and accessories online in Ghana. We are an independent retailer, not an Apple Authorized Reseller, and are not affiliated with, sponsored by, or endorsed by Apple Inc. Apple product names are trademarks of Apple Inc. and identify the products offered.
          For order help, product questions, complaints, or policy requests, contact us on
          WhatsApp or phone at{" "}
          <a className="font-medium text-hero-green" href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">
            {CONTACT_PHONE}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Orders and Payment">
        <PolicyList
          items={[
            "Orders are only confirmed after successful payment or any other payment confirmation method we approve.",
            "Prices, product availability, delivery fees, and promotions may change before checkout is completed.",
            "If a product you paid for is unavailable, we will contact you and either replace it with your approval, issue store credit, or refund that unavailable item.",
            "You are responsible for giving complete and accurate delivery details, phone numbers, and recipient information.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Product Condition">
        <p>
          Product condition, model, storage, colour, included accessories and applicable warranty are described in each listing. Review these details before ordering. Manufacturer warranty coverage is not implied by our use of a product name.
        </p>
      </PolicySection>

      <PolicySection title="Delivery and Transport Risk">
        <PolicyList
          items={[
            "After an order leaves our store or is handed to a delivery rider, courier, transport provider, or customer-arranged pickup, the risk of breakage, loss, delay, mishandling, or transit damage passes to the customer.",
            "We do not refund or replace items broken, damaged, delayed, or mishandled during transport after dispatch, unless the issue was caused by a fault from our store before dispatch.",
            "Please inspect your order immediately on delivery or pickup and report any store fault as soon as possible with clear photos or video.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Refunds, Returns, and Exchanges">
        <p>
          Refunds are handled under our Refund Policy. In summary, we only refund where there is
          a fault from our store, such as the wrong item being packed or an item having a
          pre-dispatch defect. We do not refund because of transport breakage after the item
          leaves our end.
        </p>
      </PolicySection>

      <PolicySection title="Cancellations">
        <p>
          If you need to cancel, contact us quickly. We may refuse cancellation once an order has
          been prepared, packed, dispatched, handed over for transport, or specially sourced for
          you.
        </p>
      </PolicySection>

      <PolicySection title="Account and Acceptable Use">
        <PolicyList
          items={[
            "Do not use false, incomplete, or misleading account, contact, payment, or delivery information.",
            "Do not misuse the website, attempt unauthorised access, interfere with payments, or place fraudulent orders.",
            "We may refuse, cancel, or limit orders where fraud, abuse, stock issues, pricing errors, or operational issues are suspected.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Privacy">
        <p>
          We collect and use personal information needed to process orders, payments, delivery,
          customer support, fraud prevention, and account services. Please read our Privacy Policy
          for more detail.
        </p>
      </PolicySection>

      <PolicySection title="Complaints and Governing Law">
        <p>
          Please contact us first so we can review and resolve any issue. These terms are intended
          to be governed by the laws of Ghana. Nothing in these terms is intended to remove any
          consumer right that cannot legally be excluded.
        </p>
      </PolicySection>
    </PolicyShell>
  );
}

export function RefundPolicyPage() {
  return (
    <PolicyShell
      eyebrow="Refunds and returns"
      title="Refund Policy"
      intro="This policy explains when we refund, when we do not refund, and what evidence is needed for us to review a complaint."
    >
      <PolicySection title="Our Refund Rule">
        <p>
          We only refund when the issue is caused by a fault from our store. This includes cases
          where we packed the wrong item, missed an item, or dispatched an item with a clear
          pre-existing fault.
        </p>
      </PolicySection>

      <PolicySection title="Transport Breakages">
        <p>
          We do not refund for breakages, damage, delays, loss, or mishandling that happen during
          transport after the item leaves our end. Once the item has been dispatched or handed
          over to a rider, courier, transport provider, or customer-arranged pickup, transport risk
          is on the customer.
        </p>
      </PolicySection>

      <PolicySection title="What Is Not Refundable">
        <PolicyList
          items={[
            "Damage, breakage, or delay during delivery or transport after dispatch.",
            "Damage caused by misuse, liquid exposure, accidental impact, or unauthorised modification after delivery.",
            "Cosmetic wear explicitly disclosed in the listing for a used or refurbished device.",
            "Change of mind after the order has been prepared, packed, dispatched, or specially sourced.",
          ]}
        />
      </PolicySection>

      <PolicySection title="How to Report a Store Fault">
        <PolicyList
          items={[
            "Contact us as soon as possible after receiving the order.",
            "Send your order number, delivery details, and clear photos or video showing the issue and packaging.",
            "Keep the item and packaging until we finish reviewing the complaint.",
          ]}
        />
        <p>
          Send reports through WhatsApp at{" "}
          <a className="font-medium text-hero-green" href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">
            {CONTACT_PHONE}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Refund Method">
        <p>
          Approved refunds may be processed to the original payment method, as store credit, or by
          another method we agree with you. Processing times can depend on the payment provider.
        </p>
      </PolicySection>
    </PolicyShell>
  );
}

export function PrivacyPolicyPage() {
  return (
    <PolicyShell
      eyebrow="Privacy"
      title="Privacy Policy"
      intro={`This policy explains how ${APP_NAME} collects and uses customer information for orders, delivery, payments, support, and account services.`}
    >
      <PolicySection title="Information We Collect">
        <PolicyList
          items={[
            "Account details such as name, email address, profile image, and sign-in information.",
            "Order details such as cart items, products, quantities, payment references, and order history.",
            "Delivery and contact details such as address labels, street address, city, region, phone numbers, and recipient information.",
            "Support messages, complaints, reviews, and communication records you send to us.",
          ]}
        />
      </PolicySection>

      <PolicySection title="How We Use Information">
        <PolicyList
          items={[
            "To create accounts, process orders, receive payments, arrange delivery, and provide customer support.",
            "To prevent fraud, investigate order issues, maintain security, and improve our services.",
            "To contact you about your order, delivery, refund request, account, or support request.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Sharing Information">
        <p>
          We may share only the information needed with payment processors, delivery partners,
          support tools, hosting providers, and service providers who help us run the store. We do
          not sell customer personal information.
        </p>
      </PolicySection>

      <PolicySection title="Your Choices">
        <p>
          You may contact us to request access, correction, or deletion of your personal
          information, subject to records we need to keep for orders, fraud prevention, accounting,
          legal, or dispute purposes.
        </p>
      </PolicySection>

      <PolicySection title="Security and Retention">
        <p>
          We use reasonable measures to protect customer information. We keep information for as
          long as needed for store operations, order records, legal compliance, dispute handling,
          and service improvement.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>
          For privacy questions, contact{" "}
          <a className="font-medium text-hero-green" href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">
            {CONTACT_PHONE}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
