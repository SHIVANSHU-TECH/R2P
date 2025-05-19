// lib/templates.js
export const templates = [
    {
      id: 'modern',
      name: 'Modern',
      previewComponent: () => (
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          <h3 className="text-white p-4">Modern Theme</h3>
        </div>
      ),
      component: ModernTemplate
    },
    // Add more templates
  ];
  
  function ModernTemplate({ data }) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-blue-600 text-white p-8">
          <h1 className="text-4xl font-bold">{data.name}</h1>
        </header>
        {/* Rest of template */}
      </div>
    );
  }