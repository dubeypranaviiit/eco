function ImpactCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
    const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;
    
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
        <Icon className="h-10 w-10 text-green-500 mb-4" />
        <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    )
  }
  export default ImpactCard;