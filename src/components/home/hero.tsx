"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Calendar, MapPin, Car } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import Select, {
  components,
  ControlProps,
  GroupBase,
  StylesConfig,
} from "react-select";
import { useRouter } from "@bprogress/next/app";
import { z } from "zod";
import DirhamSymbol from "../shared/DirhamSymbol";

interface SearchFormProps {
  brands: [
    {
      _id: string;
      name: string;
      logo: { url: string };
    }
  ];
  bodyTypes: [
    {
      _id: string;
      name: string;
    }
  ];
}

interface OptionType {
  value: string;
  label: string;
}

const filterSchema = z.object({
  brand: z.string().optional(),
  bodyType: z.string().optional(),
  priceRange: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const selectStyles = (): StylesConfig<
  OptionType,
  false,
  GroupBase<OptionType>
> => ({
  control: (base, state) => ({
    ...base,
    width: "100%",
    paddingLeft: "10px", // pl-10
    paddingRight: "0.75rem", // pr-3
    paddingTop: "4px", // py-3
    paddingBottom: "4px",
    borderWidth: "2px",
    borderRadius: "24px", // rounded-xl
    backgroundColor: "#fff",
    borderColor: state.isFocused
      ? "#09B4C6" // focused
      : "#94A3B84D", // soft-grey/30
    boxShadow: state.isFocused ? "0 0 0 2px #14b8a6" : "none", // focus:ring-slate-teal
    transition: "all 0.3s ease",
    fontWeight: 500,
    fontSize: "0.875rem", // text-sm
    color: "#0f172a", // text-dark-base
    "&:hover": {
      borderColor: state.isFocused ? "#09B4C6" : "#94A3B84D", // hover:border-soft-gray/30
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    marginTop: "0.25rem",
    zIndex: 20,
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#09B4C6"
      : state.isFocused
      ? "rgba(20,184,166,0.1)"
      : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
  }),
});

type FilterFormData = z.infer<typeof filterSchema>;

const HeroFormLayout = ({ brands, bodyTypes }: SearchFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      brand: "",
      bodyType: "",
      priceRange: "",
      location: "",
    },
  });

  const onSubmit = async (data: FilterFormData) => {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, String(val));
      }
    });
    router.push(`/catalog/all/cars?${params}`);
  };

  const createControlWithIcon = (Icon?: React.ElementType) => {
    const Control = <
      Option,
      IsMulti extends boolean,
      Group extends GroupBase<Option>
    >(
      props: ControlProps<Option, IsMulti, Group>
    ) => (
      <components.Control {...props}>
        {Icon && (
          <Icon
            className={`ml-3 mr-2 ${
              props.isFocused ? "text-teal-500" : "text-slate-500"
            }`}
            size={18}
          />
        )}
        {props.children}
      </components.Control>
    );

    return Control;
  };

  return (
    <div className="w-full max-w-6xl backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 animate-slide-up border border-soft-grey/20 z-9">
      <h2 className="text-base md:text-lg font-semibold text-dark-base mb-2 md:mb-3 text-center lg:text-left">
        Find Your Perfect Ride
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              Brand
            </label>
            <Controller
              control={control}
              name="brand"
              render={({ field }) => {
                const defOpt = { value: "", label: "All Brand" };
                const options =
                  brands?.map((brand) => ({
                    value: brand._id,
                    label: brand.name,
                  })) || [];
                const optArr = [defOpt, ...options];
                const Control = createControlWithIcon(Car);

                return (
                  <Select
                    {...field}
                    instanceId="brand-select"
                    isMulti={false}
                    options={optArr}
                    value={
                      optArr.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    styles={selectStyles()}
                    components={{
                      IndicatorSeparator: () => null,
                      Control,
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              Type
            </label>
            <Controller
              control={control}
              name="bodyType"
              render={({ field }) => {
                const defOpt = { value: "", label: "All Types" };
                const options =
                  bodyTypes?.map((type) => ({
                    value: type._id,
                    label: type.name,
                  })) || [];
                const optArr = [defOpt, ...options];
                const Control = createControlWithIcon(Car);

                return (
                  <Select
                    {...field}
                    instanceId="type-select"
                    isMulti={false}
                    options={optArr}
                    value={
                      optArr.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    styles={selectStyles()}
                    components={{
                      IndicatorSeparator: () => null,
                      Control,
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              Price Range
            </label>

            <Controller
              control={control}
              name="priceRange"
              render={({ field }) => {
                const optArr = [
                  { value: "", label: "Any Price" },
                  {
                    value: "500-1000",
                    label: "AED 500 - 1,000/day",
                  },
                  {
                    value: "1000-2000",
                    label: "AED 1,000 - 2,000/day",
                  },
                  {
                    value: "2000-5000",
                    label: "AED 2,000 - 5,000/day",
                  },
                  {
                    value: "5000",
                    label: "AED 5,000+/day",
                  },
                ];
                const Control = createControlWithIcon(() => (
                  <DirhamSymbol className="w-4 h-4" />
                ));

                return (
                  <Select
                    {...field}
                    instanceId="price-select"
                    isMulti={false}
                    options={optArr}
                    value={
                      optArr.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    styles={selectStyles()}
                    components={{
                      IndicatorSeparator: () => null,
                      Control,
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              Location
            </label>

            <Controller
              control={control}
              name="location"
              render={({ field }) => {
                const optArr = [
                  { value: "", label: "All Locations" },
                  {
                    value: "dubai",
                    label: "Dubai",
                  },
                  {
                    value: "abu dhabi",
                    label: "Abu Dhabi",
                  },
                  {
                    value: "sharjah",
                    label: "Sharjah",
                  },
                  {
                    value: "ajman",
                    label: "Ajman",
                  },
                  {
                    value: "ras al khaimah",
                    label: "Ras Al Khaimah",
                  },
                ];
                const Control = createControlWithIcon(MapPin);

                return (
                  <Select
                    {...field}
                    instanceId="location-select"
                    isMulti={false}
                    options={optArr}
                    value={
                      optArr.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    styles={selectStyles()}
                    components={{
                      IndicatorSeparator: () => null,
                      Control,
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-teal w-4 h-4 transition-transform group-hover:scale-110" />
              <input
                {...register("startDate")}
                type="date"
                className="block w-full min-w-0 pl-10 pr-3 py-[11px] border-2 border-soft-grey/30 rounded-xl 
  focus:ring-2 focus:ring-site-accent focus:border-site-accent transition-all duration-300 
  bg-white text-dark-base font-medium text-sm appearance-none"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-dark-base mb-1.5">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-teal w-4 h-4 transition-transform group-hover:scale-110" />
              <input
                {...register("endDate")}
                type="date"
                className="block w-full min-w-0 pl-10 pr-3 py-[11px] border-2 border-soft-grey/30 rounded-xl 
  focus:ring-2 focus:ring-site-accent focus:border-site-accent transition-all duration-300 
  bg-white text-dark-base font-medium text-sm appearance-none"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold py-3 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
        >
          <Search className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm md:text-base">Search Available Cars</span>
        </button>
      </form>
    </div>
  );
};

export default HeroFormLayout;
