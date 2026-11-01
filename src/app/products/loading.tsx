export default function ProductsLoading() {
  return (
    <div className="wrap py-10">
      <div className="skeleton h-4 w-40 rounded-full" />
      <div className="skeleton mt-4 h-10 w-72 rounded-xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
        <div className="skeleton hidden h-96 rounded-[26px] lg:block" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <div className="skeleton aspect-[4/5] rounded-[22px]" />
              <div className="skeleton mt-3 h-3 w-3/4 rounded-full" />
              <div className="skeleton mt-2 h-3 w-1/3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
