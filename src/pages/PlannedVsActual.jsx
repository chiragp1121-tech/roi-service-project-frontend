import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { projectService } from '../api/projectService';
import DataTable from '../components/DataTable';
import {
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function PlannedVsActual() {
  const { projectIdParam } = useParams();
  const [searchParams] = useSearchParams();

  // Extract ID from path param (/actual/projectid=1415 or /actual/1415) or query param
  const rawId =
    projectIdParam ||
    searchParams.get('projectId') ||
    searchParams.get('projectid') ||
    searchParams.get('id') ||
    '';
  const urlProjectId = rawId.replace(/^project_?id[=:]*/i, '').trim();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const fetchedIdRef = useRef('');

  // Fetch Planned vs Actual from API
  const fetchProjectData = useCallback(async (idToFetch) => {
    const cleanId = (idToFetch || '').trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectService.getProjectServiceActual(cleanId);
      setApiData(response);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch Planned vs Actual data from API.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch immediately once when urlProjectId is available
  useEffect(() => {
    if (urlProjectId && fetchedIdRef.current !== urlProjectId) {
      fetchedIdRef.current = urlProjectId;
      fetchProjectData(urlProjectId);
    }
  }, [urlProjectId, fetchProjectData]);

  const tables = apiData?.tables || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-[#0c72af] animate-spin" />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">API Error</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Main Planned vs Actual Table (Default Top View) */}
      {apiData && (
        <div>
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-900">Planned vs Actual</h2>
          </div>

          <DataTable
            data={tables.planned_vs_actual}
            emptyMessage="No planned vs actual comparison records found for this project."
          />

          {/* 3. "Show more details" Collapsible Accordion */}
          <div className="mt-8 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-left transition cursor-pointer border-b border-transparent data-[expanded=true]:border-gray-200"
              data-expanded={showMoreDetails}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                {showMoreDetails ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span>Show more details</span>
              </div>
            </button>

            {/* Expanded Detailed Tables */}
            {showMoreDetails && (
              <div className="p-5 sm:p-6 space-y-8 bg-gray-50/40 border-t border-gray-200">
                {/* Actual Services */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Actual Services</h3>
                  <DataTable data={tables.actual} />
                </div>

                {/* Current Services */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Current Services (matching current services)
                  </h3>
                  <DataTable data={tables.current_services} />
                </div>

                {/* Future Services */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Future Services</h3>
                  <DataTable data={tables.future_services} />
                </div>

                {/* Cost and Schedule */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Cost and Schedule</h3>
                  <DataTable data={tables.cost_schedule} />
                </div>

                {/* Future - Current Margin Contribution */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Future - Current Margin Contribution
                  </h3>
                  <DataTable data={tables.future_current_margin} />
                </div>

                {/* Summary Table */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Summary Overview</h3>
                  <DataTable data={tables.summary} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
