"use client";

import { useState, useEffect, InputHTMLAttributes, ReactNode } from "react";
import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car as CarIcon,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/lib/api/profileApi";

// API response types
type UserProfileData = {
  name: string;
  email: string;
  phoneNum: string;
  emiratesId: string;
  licenseNum: string;
  address: string;
  emirate: string;
};

// type UserProfile = {
//   success: boolean;
//   data: UserProfileData;
// };

// Form type
type ProfileForm = {
  name: string;
  email: string;
  mobile: string;
  emiratesId: string;
  licenseNumber: string;
  address: string;
  emirate: string;
};

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [getUserProfile, { data: profileFromApi, isFetching }] =
    useLazyGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const { register, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      emiratesId: "",
      licenseNumber: "",
      address: "",
      emirate: "",
    },
  });

  // Fetch profile on mount
  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  // Update form when profile is fetched
  useEffect(() => {
    if (!profileFromApi) return;

    let payload: UserProfileData | undefined;

    if ("data" in profileFromApi) {
      payload = profileFromApi.data as UserProfileData;
    } else {
      payload = profileFromApi as UserProfileData;
    }

    if (payload) {
      reset({
        name: payload.name || "",
        email: payload.email || "",
        mobile: payload.phoneNum || "",
        emiratesId: payload.emiratesId || "",
        licenseNumber: payload.licenseNum || "",
        address: payload.address || "",
        emirate: payload.emirate || "",
      });
    }
  }, [profileFromApi, reset]);

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    try {
      await updateUserProfile({
        name: data.name,
        phoneNum: data.mobile,
        emiratesId: data.emiratesId,
        licenseNum: data.licenseNumber,
        address: data.address,
        emirate: data.emirate,
      }).unwrap();

      toast.success("Profile updated successfully");
      setIsEditing(false);
      getUserProfile(); // Refresh profile
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (!profileFromApi) return;

    let payload: UserProfileData | undefined;

    if ("data" in profileFromApi) {
      payload = profileFromApi.data as UserProfileData;
    } else {
      payload = profileFromApi as UserProfileData;
    }

    if (payload) {
      reset({
        name: payload.name || "",
        email: payload.email || "",
        mobile: payload.phoneNum || "",
        emiratesId: payload.emiratesId || "",
        licenseNumber: payload.licenseNum || "",
        address: payload.address || "",
        emirate: payload.emirate || "",
      });
    }
    setIsEditing(false);
  };

  if (isFetching) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark-base">
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-site-accent text-white rounded-lg hover:bg-slate-teal transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border-2 border-soft-grey/30 text-dark-base rounded-lg hover:bg-soft-grey/10 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
            >
              <Save className="w-4 h-4" />{" "}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          icon={<User className="w-4 h-4 text-site-accent" />}
          register={register("name")}
          disabled={!isEditing}
        />
        <InputField
          label="Email"
          icon={<Mail className="w-4 h-4 text-site-accent" />}
          register={register("email")}
          disabled
        />
        <InputField
          label="Phone Number"
          icon={<Phone className="w-4 h-4 text-site-accent" />}
          register={register("mobile")}
          disabled={!isEditing}
        />
        <InputField
          label="Emirates ID"
          icon={<User className="w-4 h-4 text-site-accent" />}
          register={register("emiratesId")}
          disabled={!isEditing}
        />
        <InputField
          label="License Number"
          icon={<CarIcon className="w-4 h-4 text-site-accent" />}
          register={register("licenseNumber")}
          disabled={!isEditing}
        />

        {/* Emirate */}
        <div>
          <label className="block text-sm font-semibold text-dark-base mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-site-accent" /> Emirate
          </label>
          <select
            {...register("emirate")}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-colors ${
              isEditing
                ? "border-soft-grey/30 focus:border-site-accent focus:outline-none"
                : "border-soft-grey/20 bg-soft-grey/10 cursor-not-allowed"
            }`}
          >
            <option value="">Select Emirate</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-dark-base mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-site-accent" /> Address
          </label>
          <textarea
            {...register("address")}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-colors ${
              isEditing
                ? "border-soft-grey/30 focus:border-site-accent focus:outline-none"
                : "border-soft-grey/20 bg-soft-grey/10 cursor-not-allowed"
            }`}
          />
        </div>
      </div>
    </form>
  );
}

// ✅ Reusable Input Field Component
interface InputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "onChange" | "onBlur" | "ref"
  > {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  register: UseFormRegisterReturn;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  disabled,
  register,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-dark-base mb-2">
        <div className="flex items-center gap-2">
          {icon} {label}
        </div>
      </label>
      <input
        {...register}
        {...props}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors ${
          disabled
            ? "border-soft-grey/20 bg-soft-grey/10 cursor-not-allowed"
            : "border-soft-grey/30 focus:border-site-accent focus:outline-none"
        }`}
      />
    </div>
  );
};