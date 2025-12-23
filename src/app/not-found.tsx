import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-slate-800">
        🚧 We’re Working on This Section
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        This section is currently under development.  
        In the meantime, feel free to browse our wide collection of luxury cars.
      </p>
      <Link
        href="/catalog/all/cars"
        className="py-2 bg-gradient-to-r from-site-accent to-slate-teal text-white md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Browse Cars
      </Link>
    </div>
  );
};

export default NotFound;
