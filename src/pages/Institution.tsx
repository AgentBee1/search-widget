import { useEffect, useState } from 'react';
import axios from 'axios';

interface LinkedIncident {
  id: string;
  incident_id?: string;
  agent_id?: string;
  link_type?: string;
  created_at: string;
  incidents?: {
    id: string;
    source_url: string;
    agent_id: string;
    severity_weight: number;
    agents: {
      id: string;
      agency_name: string;
    };
  };
  agents?: {
    id: string;
    agency_name: string;
  };
}

export default function Institution() {
  const [data, setData] = useState<LinkedIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get params from URL
  const params = new URLSearchParams(window.location.search);
  const institutionId = params.get('id');
  const backendUrl = params.get('backend') || 'https://3000-i6ioccowiv29g4dxplu8n-c79ad93e.sg1.manus.computer';
  const type = (params.get('type') || 'linked') as 'linked' | 'authorised';

  useEffect(() => {
    if (!institutionId) {
      setError('Missing institution ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'linked' 
          ? `/api/public/linked-incidents/${institutionId}`
          : `/api/public/authorised-agents/${institutionId}`;
        
        const response = await axios.get(`${backendUrl}${endpoint}`);
        setData(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [institutionId, backendUrl, type]);

  const getSeverityColor = (weight: number) => {
    if (weight >= 60) return 'bg-red-100 text-red-800';
    if (weight >= 30) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const getSeverityLabel = (weight: number) => {
    if (weight >= 60) return 'Red';
    if (weight >= 30) return 'Amber';
    return 'Green';
  };

  const isLinkedView = type === 'linked';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AgentBee · {isLinkedView ? 'Linked Incidents' : 'Authorised Agents'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${data.length} ${isLinkedView ? 'incidents' : 'agents'} found`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">No {isLinkedView ? 'incidents' : 'agents'} found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  {isLinkedView ? (
                    <>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Agent Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Report Link
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Agent Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Authorised Date
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {isLinkedView ? (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.incidents?.agents.agency_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                              item.incidents?.severity_weight || 0
                            )}`}
                          >
                            {getSeverityLabel(item.incidents?.severity_weight || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={item.incidents?.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs inline-block"
                          >
                            View Report
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.agents?.agency_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Authorised
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


      </div>
    </div>
  );
}
