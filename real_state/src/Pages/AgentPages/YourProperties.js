import React, { useState, useEffect, useContext } from "react";
import API from "../../Axios/axios";
import { AuthContext } from "../../context/AuthContext";
import { MapPin, Square, BedDouble, Sofa, X, ChevronLeft, ChevronRight } from "lucide-react";

const YourProperties = () => {
  const { user, loadingUser} = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    property_type: "",
    floor: "",
    price: "",
    address: "",
    owner_name: "",
    area: "",
    rooms: "",
    furnished: false,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

   const handleCardClick = (property) => {
    setSelectedProperty(property);
    setCurrentImage(0);
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

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

  // Fetch user's properties
  const fetchProperties = async () => {
    try {
      const response = await API.get("/properties/properties/");
      console.log(user);
      const userProperties = response.data.filter(
        (p) => p.dealer_id === user?.id
      );
      setProperties(userProperties);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      fetchProperties();
    }
  }, [loadingUser, user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
  setImages((prev) => [...prev, ...Array.from(e.target.files)]);
};

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload with correct types
      const payload = {
        dealer_id: user.id,
        property_type: formData.property_type,
        floor: formData.floor ? parseInt(formData.floor) : null,
        price: parseFloat(formData.price),
        address: formData.address,
        owner_name: formData.owner_name,
        area: formData.area,
        rooms: parseInt(formData.rooms),
        furnished: formData.furnished,
      };

      const propertyResponse = await API.post("/properties/properties/", payload);
      const propertyId = propertyResponse.data.id;

      for (let i = 0; i < images.length; i++) {
        const imageData = new FormData();
        imageData.append("property", propertyId);
        imageData.append("image", images[i]);

        await API.post("/properties/property-images/", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Property created successfully!");
      setShowModal(false);
      setFormData({
        property_type: "",
        floor: "",
        price: "",
        address: "",
        owner_name: "",
        area: "",
        rooms: "",
        furnished: false,
      });
      setImages([]);
      fetchProperties(); // Refresh the list
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating property");
    } finally {
      setLoading(false);
    }
  };

  
  if (loadingUser) {
    return <div className="p-6">Loading your account...</div>;
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Properties</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
        >
          Upload Property
        </button>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            onClick={() => handleCardClick(property)}
            className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition relative"
          >
            {/* Property Images */}
            {property.images?.length > 0 && (
              <div className={`grid gap-1 rounded-t-lg overflow-hidden h-48 ${
                property.images.length === 1
                  ? ""
                  : property.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}>
                {property.images.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.image}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for extra images */}
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
              <h3 className="font-bold text-lg mb-2">{property.property_type}</h3>
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


      {/* Fullscreen Image Viewer */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-3xl"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Image */}
          <img
            src={selectedProperty.images[currentImage].image}
            alt="Property"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-3xl"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Add Property</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="Room">Room</option>
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Portion">Portion</option>
              </select>

              <input
                type="text"
                name="floor"
                placeholder="Floor (optional)"
                value={formData.floor}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price / Rent"
                value={formData.price}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="owner_name"
                placeholder="Owner Name"
                value={formData.owner_name}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="area"
                placeholder="Area (e.g., 10 Marla)"
                value={formData.area}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="number"
                name="rooms"
                placeholder="Rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="mr-2"
                />
                Furnished
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mb-3"
              />

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-full h-full object-cover rounded"
                        />
                        {/* ❌ Remove button */}
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourProperties;
