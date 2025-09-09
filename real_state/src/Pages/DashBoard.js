import { useState, useContext, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {AuthContext} from "../context/AuthContext";
import API from "../Axios/axios";
import { MapPin, Square, BedDouble, Sofa, X, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";


  const data = [
    { name: "Available Properties", value: 20 },
    { name: "Ongoing Deals", value: 10 },
    { name: "Closed Deals", value: 15 },
    { name: "Appointments", value: 5 },
    { name: "Revenue", value: 15.0 },
  ];

const DashboardHome = () => {
  // Dummy stats data for agents
  const {user, setUser} = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState(50000);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [dealType, setDealType] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [savedProperties, setSavedProperties] = useState([]);

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setCurrentImage(0);
  };

  useEffect(()=>{
    if (user){
      setSavedProperties(user.saved_properties);
    }
  }, [user]);

  const saveProperty = async (property) => {
    try{ 

      await API.post("users/saved-properties/toggle/", {property_id: property.id});
      setSavedProperties((prevSaved) => {
        let updatedSaved;
        if (prevSaved.includes(property.id)) {
          updatedSaved = prevSaved.filter((id) => id !== property.id);
        } else {
          updatedSaved = [...prevSaved, property.id];
        }

        const updatedUser = {
        ...user,
        saved_properties: updatedSaved,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedSaved;
      });

    } catch(error){
        console.log("error adding the property", error);
    }
  }

  
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

    const fetchProperties = async () => {
    try {
      const response = await API.get("/properties/properties/");
      
      setProperties(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  console.log(properties);

   useEffect(() => {
      fetchProperties();
    }, [price, location, propertyType, dealType]);


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>

        {/* Buyer Filter Button */}
        {user?.role === "buyer" && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Filter Preferences
          </button>
        )}
      </div>

      {/* Buyer: Property Cards */}
      {user?.role === "buyer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {properties.map((property) => (
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
              {/* Save Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    saveProperty(property);
                  }}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                >
                 <Bookmark
                    className={`h-5 w-5 ${
                      savedProperties.includes(property.id) ? "text-indigo-800 fill-indigo-700" : "text-gray-700"
                    }`}
                  />

                </button>
            </div>
          ))}
        </div>
      )}

      {/* Agent: Charts */}
      {user?.role === "agent" && (
        <div className="mt-6 w-full h-72">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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

      {/* Buyer Filter Modal */}
      {showModal && user?.role === "buyer" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Set Your Preferences</h3>

            {/* Price */}
            <div className="mb-4">
              <label className="block font-medium">Max Price</label>
              <input
                type="range"
                min="0"
                max="999999"
                step="5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-600">Selected: {price}</p>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter preferred location"
              />
            </div>

            {/* Property Type */}
            <div className="mb-4">
              <label className="block font-medium">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="">Select</option>
                <option value="room">Room</option>
                <option value="portion">Portion</option>
                <option value="house">House</option>
              </select>
            </div>

            {/* Deal Type */}
            <div className="mb-4">
              <label className="block font-medium">Deal Type</label>
              <select
                value={dealType}
                onChange={(e) => setDealType(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="">Select</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log({ price, location, propertyType, dealType });
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
