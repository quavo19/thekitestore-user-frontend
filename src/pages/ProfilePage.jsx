import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import googleIcon from "@/assets/svgs/Google.svg?raw";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { ROUTES } from "@/constants";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";
import { cn } from "@/utils";

const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

const GHANA_REGION_OPTIONS = GHANA_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

const PHONE_CODE_OPTIONS = [{ value: "+233", label: "+233" }];

const inputClassName =
  "mt-1 w-full rounded-2xl bg-hero-sage/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:bg-hero-sage/60 disabled:text-hero-muted";

const addressInputClassName =
  "rounded-2xl bg-hero-sage/40 px-4 py-3 text-sm outline-none transition-colors focus:bg-hero-sage/60";

const emptyAddress = {
  name: "",
  line1: "",
  city: "",
  region: "",
  country: "Ghana",
  is_default: false,
};

function normalizeAddress(record) {
  const attrs = record?.attributes ?? record ?? {};
  return {
    id: record?.id ?? attrs.id,
    name: attrs.name || "",
    line1:
      attrs.address?.line1 ||
      attrs.address?.street ||
      attrs.address?.formatted ||
      "",
    city: attrs.city || "",
    region: attrs.region || "",
    country: attrs.country || "Ghana",
    is_default: Boolean(attrs.is_default),
  };
}

function addressPayload(address) {
  return {
    name: address.name.trim(),
    city: address.city.trim(),
    region: address.region.trim(),
    country: "Ghana",
    is_default: address.is_default,
    address: {
      line1: address.line1.trim(),
    },
  };
}

function splitPhone(phone) {
  const cleaned = String(phone || "").replace(/\s+/g, "");
  return cleaned.startsWith("+233") ? cleaned.slice(4) : cleaned;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "");
}

function hasDuplicatePhone(phones, nextPhone, index) {
  const normalizedNext = normalizePhone(nextPhone);
  if (!normalizedNext || normalizedNext === "+233") return false;
  return phones.some((phone, phoneIndex) => {
    if (phoneIndex === index) return false;
    return normalizePhone(phone) === normalizedNext;
  });
}

function PhoneNumberInput({ value, disabled, onChange }) {
  return (
    <div className="mt-1 flex min-w-0 gap-2">
      <SelectDropdown
        value="+233"
        options={PHONE_CODE_OPTIONS}
        disabled={disabled}
        onChange={() => {}}
        className="w-24 shrink-0"
        buttonClassName="px-3"
        menuClassName="min-w-24"
      />
      <input
        value={splitPhone(value)}
        disabled={disabled}
        onChange={(event) => onChange(`+233${event.target.value.replace(/\D/g, "")}`)}
        inputMode="tel"
        placeholder="Phone number"
        className="min-w-0 flex-1 rounded-2xl bg-hero-sage/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:bg-hero-sage/60 disabled:text-hero-muted"
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="text-sm font-light text-hero-muted">
      {label}
      {children}
    </label>
  );
}

export function ProfilePage() {
  const {
    user,
    isAuthenticated,
    isLoadingUser,
    startGoogleAuth,
    updateProfile,
    fetchCurrentUser,
  } = useUser();
  const [profileDraft, setProfileDraft] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const avatarSrc = user?.avatar;
  const displayName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.email ||
    "Plant lover";
  const bonusBalance = Number(user?.bonus?.balance || 0);
  const userPhones = Array.isArray(user?.phone_numbers)
    ? user.phone_numbers.filter(Boolean).slice(0, 3)
    : [];
  const firstName = profileDraft?.firstName ?? user?.first_name ?? "";
  const lastName = profileDraft?.lastName ?? user?.last_name ?? "";
  const phones = profileDraft?.phones ?? (userPhones.length ? userPhones : [""]);
  const canAddPhone = phones.length < 3;
  const canCreateAddress = addresses.length < 3;
  const isEditingAddress = Boolean(editingAddressId || isAddingAddress);
  const defaultAddress = useMemo(
    () => addresses.find((address) => address.is_default) || addresses[0],
    [addresses],
  );

  function updateProfileDraft(nextDraft) {
    setProfileDraft({
      firstName,
      lastName,
      phones,
      ...nextDraft,
    });
  }

  async function refreshAddresses() {
    const response = await customerService.getAddresses();
    setAddresses((response?.data || []).map(normalizeAddress));
  }

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setTimeout(() => {
      refreshAddresses().catch((nextError) => {
        setError(nextError.message || "Unable to load your addresses.");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!message && !error) return undefined;
    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [error, message]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setIsSavingProfile(true);
    setError("");
    setMessage("");

    try {
      const nextPhones = phones.map(normalizePhone).filter(Boolean).slice(0, 3);
      if (new Set(nextPhones).size !== nextPhones.length) {
        setError("Phone numbers cannot be duplicated.");
        return;
      }

      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_numbers: nextPhones,
      });
      setProfileDraft(null);
      setIsEditingProfile(false);
      setMessage("Profile updated successfully");
    } catch (nextError) {
      setError(nextError.message || "Unable to update your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleAddressSubmit(event) {
    event.preventDefault();
    setIsSavingAddress(true);
    setError("");
    setMessage("");

    try {
      if (!addressForm.region) {
        setError("Please select a region.");
        return;
      }

      const payload = addressPayload(addressForm);
      if (editingAddressId) {
        await customerService.updateAddress(editingAddressId, payload);
      } else {
        await customerService.createAddress(payload);
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      setIsAddingAddress(false);
      await refreshAddresses();
      await fetchCurrentUser();
      setMessage(editingAddressId ? "Address updated." : "Address saved.");
    } catch (nextError) {
      setError(nextError.message || "Unable to save this address.");
    } finally {
      setIsSavingAddress(false);
    }
  }

  function startAddressEdit(address) {
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
    setAddressForm({ ...address, country: "Ghana" });
  }

  function startAddressCreate() {
    setEditingAddressId(null);
    setIsAddingAddress(true);
    setAddressForm(emptyAddress);
  }

  function cancelAddressEdit() {
    setEditingAddressId(null);
    setIsAddingAddress(false);
    setAddressForm(emptyAddress);
  }

  async function deleteAddress(id) {
    setError("");
    setMessage("");
    try {
      await customerService.deleteAddress(id);
      if (editingAddressId === id) cancelAddressEdit();
      await refreshAddresses();
      await fetchCurrentUser();
      setMessage("Address removed.");
    } catch (nextError) {
      setError(nextError.message || "Unable to delete this address.");
    }
  }

  async function setDefaultAddress(id) {
    setError("");
    setMessage("");
    try {
      await customerService.setDefaultAddress(id);
      await refreshAddresses();
      await fetchCurrentUser();
      setMessage("Default address updated.");
    } catch (nextError) {
      setError(nextError.message || "Unable to update default address.");
    }
  }

  if (!isAuthenticated && !isLoadingUser) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <p className="font-serif text-4xl text-hero-dark">Your profile</p>
        <p className="mt-3 max-w-md text-sm font-light leading-6 text-hero-muted">
          Sign in to save your delivery details, phone numbers, and order preferences.
        </p>
        <button
          type="button"
          onClick={startGoogleAuth}
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-hero-green px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <Icon svg={googleIcon} className="h-4 w-4" />
          </span>
          Sign in with Google
        </button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="bg-hero-sage/25 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              src={avatarSrc}
              name={displayName}
              alt={displayName}
              className="aspect-square h-20 w-20 shrink-0 text-5xl"
            />
            <div>
              <p className="font-serif text-3xl text-hero-dark">{displayName}</p>
              <p className="mt-1 text-sm font-light text-hero-muted">{user?.email}</p>
              <p className="mt-3 inline-flex rounded-full bg-white px-4 py-1 text-xs font-medium text-hero-green">
                Google account
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
                Bonus points
              </p>
              <p className="mt-3 font-serif text-3xl text-hero-dark">
                #{bonusBalance.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-light leading-6 text-hero-muted">
                Earn points when you buy eligible products.
              </p>
            </div>
            <div className="bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
              Default delivery
            </p>
            <p className="mt-3 font-serif text-xl text-hero-dark">
              {defaultAddress?.name || "No address saved"}
            </p>
            <p className="mt-1 text-sm font-light leading-6 text-hero-muted">
              {defaultAddress
                ? [defaultAddress.line1, defaultAddress.city, defaultAddress.region, "Ghana"]
                    .filter(Boolean)
                    .join(", ")
                : "Add an address below so checkout can move faster."}
            </p>
            </div>
          </div>
        </div>
      </section>

      {(message || error) && (
        <div
          className={cn(
            "px-5 py-3 text-sm font-light",
            error ? "bg-red-50 text-red-700" : "bg-hero-sage/50 text-hero-dark",
          )}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleProfileSubmit} className="bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl text-hero-dark">Profile details</h1>
              <p className="mt-1 text-sm font-light text-hero-muted">
                Keep your contact details ready for orders.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="cursor-pointer text-sm font-bold text-hero-green"
            >
              Edit
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <input
                value={firstName}
                disabled={!isEditingProfile}
                onChange={(event) => updateProfileDraft({ firstName: event.target.value })}
                className={inputClassName}
              />
            </Field>
            <Field label="Last name">
              <input
                value={lastName}
                disabled={!isEditingProfile}
                onChange={(event) => updateProfileDraft({ lastName: event.target.value })}
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-light text-hero-muted">Phone numbers</p>
              <span className="text-xs text-hero-green">{phones.filter(Boolean).length}/3</span>
            </div>
            {phones.map((phone, index) => (
              <div key={index} className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <PhoneNumberInput
                    value={phone}
                    disabled={!isEditingProfile}
                    onChange={(nextPhone) => {
                      if (hasDuplicatePhone(phones, nextPhone, index)) {
                        setError("Phone numbers cannot be duplicated.");
                        return;
                      }
                      const next = [...phones];
                      next[index] = nextPhone;
                      updateProfileDraft({ phones: next });
                    }}
                  />
                </div>
                {isEditingProfile && phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateProfileDraft({
                        phones: phones.filter((_, phoneIndex) => phoneIndex !== index),
                      })
                    }
                    className="cursor-pointer px-3 text-sm font-medium text-hero-muted hover:text-ink"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditingProfile && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!canAddPhone}
                onClick={() => updateProfileDraft({ phones: [...phones, "+233"] })}
                className="cursor-pointer rounded-full border border-hero-green px-5 py-2 text-sm font-medium text-hero-green transition-colors hover:bg-hero-green/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add phone
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? "Saving..." : "Save profile"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileDraft(null);
                  setIsEditingProfile(false);
                }}
                className="cursor-pointer rounded-full bg-hero-sage/30 px-5 py-2 text-sm font-medium text-hero-muted hover:text-ink"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <section className="bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-hero-dark">Addresses</h2>
              <p className="mt-1 text-sm font-light text-hero-muted">
                Save up to three delivery addresses.
              </p>
            </div>
            {canCreateAddress && !isEditingAddress && (
              <button
                type="button"
                onClick={startAddressCreate}
                className="cursor-pointer text-sm font-bold text-hero-green"
              >
                Edit
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-3">
            {addresses.map((address) => (
              <div key={address.id} className="bg-hero-sage/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-hero-dark">{address.name}</p>
                    <p className="mt-1 text-sm font-light leading-6 text-hero-muted">
                      {[address.line1, address.city, address.region, "Ghana"]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  {address.is_default && (
                    <span className="bg-white px-3 py-1 text-xs text-hero-green">Default</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {!address.is_default && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(address.id)}
                      className="cursor-pointer font-medium text-hero-green hover:opacity-80"
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startAddressEdit(address)}
                    className="cursor-pointer font-bold text-hero-green"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAddress(address.id)}
                    className="cursor-pointer text-red-600 hover:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isEditingAddress && (
            <form onSubmit={handleAddressSubmit} className="mt-5 grid gap-3 bg-hero-sage/10 p-4">
              <input
                value={addressForm.name}
                onChange={(event) => setAddressForm({ ...addressForm, name: event.target.value })}
                required
                placeholder="Address label, e.g. Home"
                className={addressInputClassName}
              />
              <input
                value={addressForm.line1}
                onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })}
                required
                placeholder="Street address"
                className={addressInputClassName}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={addressForm.city}
                  onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
                  placeholder="City"
                  className={addressInputClassName}
                />
                <SelectDropdown
                  value={addressForm.region}
                  options={GHANA_REGION_OPTIONS}
                  onChange={(region) => setAddressForm({ ...addressForm, region })}
                  placeholder="Region"
                />
                <input
                  value="Ghana"
                  disabled
                  className="rounded-2xl bg-hero-sage/30 px-4 py-3 text-sm text-hero-muted outline-none"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-light text-hero-muted">
                <Checkbox
                  checked={addressForm.is_default}
                  onChange={(event) =>
                    setAddressForm({ ...addressForm, is_default: event.target.checked })
                  }
                />
                Use as default address
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingAddress ? "Saving..." : editingAddressId ? "Update address" : "Save address"}
                </button>
                <button
                  type="button"
                  onClick={cancelAddressEdit}
                  className="cursor-pointer rounded-full bg-hero-sage/30 px-5 py-2 text-sm font-medium text-hero-muted hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!canCreateAddress && !isEditingAddress && (
            <p className="mt-5 bg-hero-sage/25 px-4 py-3 text-sm font-light text-hero-muted">
              You have reached the 3 address limit. Edit or delete one to add another.
            </p>
          )}
        </section>
      </div>

      <Link
        to={ROUTES.ORDERS}
        className="inline-flex cursor-pointer rounded-full bg-hero-dark px-5 py-2 text-sm font-medium text-white"
      >
        View orders
      </Link>
    </div>
  );
}
