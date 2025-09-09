// src/pages/SavedProperties.js
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../Axios/axios";
import {
  MapPin,
  Square,
  BedDouble,
  Sofa,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SavedProperties = () => {
  const { user, loadingUser } = useContext(AuthContext);
  const [savedProperties, setSavedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const fetchSaved = async () => {
    try {
      if (!user?.saved_properties || user.saved_properties.length === 0) {
        setSavedProperties([]);
        return;
      }

      const queryString = user.saved_properties
        .map((id) => `saved_properties=${id}`)
        .join("&");

      const res = await API.get(`/properties/properties/?${queryString}`);
      setSavedProperties(res.data); 
    } catch (err) {
      console.error("Error fetching saved properties:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      fetchSaved();
    }
  }, [loadingUser, user]);

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setCurrentImage(0);
  };

  const closeModal = () => setSelectedProperty(null);

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImage((prev) =>
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImage((prev) =>
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loadingUser) {
    return <div className="p-6">Loading saved properties...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Saved Properties</h2>

      {savedProperties.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => handleCardClick(property)}
              className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition relative"
            >
              {/* Property Images */}
              {property.images?.length > 0 && (
                <div
                  className={`grid gap-1 rounded-t-lg overflow-hidden h-48 ${
                    property.images.length === 1
                      ? ""
                      : property.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {property.images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img.image}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                      {property.images.length > 3 && idx === 2 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl">
                          +{property.images.length - 2}
                        </div>
                      )}
                      {property.images.length === 3 && idx === 2 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl">
                          +1
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Property Details */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">
                  {property.property_type}
                </h3>
                <p className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-600" /> {property.address}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 text-gray-600" /> Rs. {property.price}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <Square className="w-4 h-4 text-gray-600" /> {property.area}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <BedDouble className="w-4 h-4 text-gray-600" /> {property.rooms} rooms
                </p>
                <p className="flex items-center gap-2">
                  <Sofa className="w-4 h-4 text-gray-600" />{" "}
                  {property.furnished ? "Furnished" : "Unfurnished"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-3xl"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={selectedProperty.images[currentImage].image}
            alt="Property"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-3xl"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedProperties;
