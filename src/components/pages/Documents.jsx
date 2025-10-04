import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import documentService from "@/services/api/documentService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await documentService.getAll();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = documents;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documents]);

  const categories = ["All", ...new Set(documents.map(doc => doc.category))];

  const getIconForCategory = (category) => {
    const icons = {
      Policies: "FileText",
      Forms: "ClipboardList",
      Benefits: "Heart",
      Company: "Building2",
      Safety: "Shield"
    };
    return icons[category] || "FileText";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-secondary">Access company policies, forms, and important documents</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Empty
          icon="Search"
          title="No documents found"
          message="Try adjusting your search or filter criteria"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-all duration-200">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name={getIconForCategory(doc.category)} className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {doc.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-sm text-secondary mb-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="FileText" className="w-4 h-4" />
                    <span>{doc.size}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;