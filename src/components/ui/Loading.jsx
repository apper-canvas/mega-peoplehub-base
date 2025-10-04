const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
        <p className="text-secondary text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;