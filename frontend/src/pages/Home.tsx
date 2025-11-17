import { useState, useEffect } from "react";
import axios, { csrf } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface GeoInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

interface HistoryItem {
  id: string;
  ip: string;
  timestamp: Date;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useAuth();

  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [searchIp, setSearchIp] = useState("");
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's current IP and geolocation on mount
  useEffect(() => {
    fetchUserGeoInfo();
  }, []);

  const fetchUserGeoInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://ipinfo.io/geo");
      const data = await response.json();
      setGeoInfo(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch your location information");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateIpAddress = (ip: string): boolean => {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    if (ipv4Pattern.test(ip)) {
      const parts = ip.split(".");
      return parts.every(
        (part) => parseInt(part) >= 0 && parseInt(part) <= 255
      );
    }

    return ipv6Pattern.test(ip);
  };

  const fetchGeoInfo = async (ip: string) => {
    if (!validateIpAddress(ip)) {
      setError("Please enter a valid IP address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`https://ipinfo.io/${ip}/geo`);
      const data = await response.json();

      if (data.error || data.bogon) {
        setError("Invalid IP address or no geolocation data available");
        return;
      }

      setGeoInfo(data);

      // Add to history
      const newHistory: HistoryItem = {
        id: Date.now().toString(),
        ip: ip,
        timestamp: new Date(),
      };
      setSearchHistory((prev) => [newHistory, ...prev]);
    } catch (err) {
      setError("Failed to fetch geolocation information");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIp.trim()) {
      fetchGeoInfo(searchIp.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchIp("");
    setError("");
    fetchUserGeoInfo();
  };

  const handleHistoryClick = (ip: string) => {
    setSearchIp(ip);
    fetchGeoInfo(ip);
  };

  const toggleHistorySelection = (id: string) => {
    const newSelected = new Set(selectedHistory);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedHistory(newSelected);
  };

  const handleDeleteSelected = () => {
    setSearchHistory((prev) =>
      prev.filter((item) => !selectedHistory.has(item.id))
    );
    setSelectedHistory(new Set());
  };

  const handleLogout = async () => {
    try {
      await csrf();
      await axios.post("/logout");
      await fetchUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl">No user logged in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                IP Geolocation Tracker
              </h1>
              <p className="text-gray-600 mt-1">Logged in as: {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search & Geo Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Search IP Address</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={searchIp}
                    onChange={(e) => setSearchIp(e.target.value)}
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Geolocation Info */}
            {geoInfo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Geolocation Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">IP Address</p>
                    <p className="text-lg font-semibold">{geoInfo.ip}</p>
                  </div>
                  {geoInfo.city && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">City</p>
                      <p className="text-lg font-semibold">{geoInfo.city}</p>
                    </div>
                  )}
                  {geoInfo.region && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Region</p>
                      <p className="text-lg font-semibold">{geoInfo.region}</p>
                    </div>
                  )}
                  {geoInfo.country && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="text-lg font-semibold">{geoInfo.country}</p>
                    </div>
                  )}
                  {geoInfo.loc && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Coordinates</p>
                      <p className="text-lg font-semibold">{geoInfo.loc}</p>
                    </div>
                  )}
                  {geoInfo.org && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Organization</p>
                      <p className="text-lg font-semibold">{geoInfo.org}</p>
                    </div>
                  )}
                  {geoInfo.timezone && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Timezone</p>
                      <p className="text-lg font-semibold">
                        {geoInfo.timezone}
                      </p>
                    </div>
                  )}
                  {geoInfo.postal && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Postal Code</p>
                      <p className="text-lg font-semibold">{geoInfo.postal}</p>
                    </div>
                  )}
                </div>

                {/* Map (Optional - Big Plus) */}
                {geoInfo.loc && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${geoInfo.loc}&output=embed`}
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Search History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Search History</h2>
                {selectedHistory.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    Delete ({selectedHistory.size})
                  </button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No search history yet
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHistory.has(item.id)}
                        onChange={() => toggleHistorySelection(item.id)}
                        className="w-4 h-4"
                      />
                      <div
                        onClick={() => handleHistoryClick(item.ip)}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="font-semibold text-blue-600">{item.ip}</p>
                        <p className="text-xs text-gray-500">
                          {item.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
