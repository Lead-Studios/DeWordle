export const StatsCard = () => {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-[#2c2c2c] md:text-xl">
        My Stats
      </h2>
      <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Points</p>
            <p className="font-medium text-sm md:text-base">0</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Played</p>
            <p className="font-medium text-sm md:text-base">0</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Win rate</p>
            <p className="font-medium text-sm md:text-base">0%</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Current streak</p>
            <p className="font-medium text-sm md:text-base">0</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Max streak</p>
            <p className="font-medium text-sm md:text-base">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};
