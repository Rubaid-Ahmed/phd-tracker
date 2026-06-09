import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UniversityLogo from '../components/UniversityLogo';
import AdmissionDates from '../components/AdmissionDates';
import Opportunities from '../components/Opportunities';
import Professors from '../components/Professors';

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, updateUniversity } = useApp();
  const university = data.universities.find(u => u.id === id);

  if (!university) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-slate-500">University not found</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    );
  }

  function patchDates(admissionDates) {
    updateUniversity({ ...university, admissionDates });
  }
  function patchOpportunities(opportunities) {
    updateUniversity({ ...university, opportunities });
  }
  function patchProfessors(professors) {
    updateUniversity({ ...university, professors });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* University header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate('/')} className="btn-ghost mb-4 -ml-1">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-5">
            <UniversityLogo name={university.name} domain={university.domain} size={72} className="shadow-card" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {university.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={13} /> {university.city}, {university.country}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                  <Trophy size={13} /> QS Rank #{university.rank}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AdmissionDates
            dates={university.admissionDates || []}
            onChange={patchDates}
          />
          <Opportunities
            opportunities={university.opportunities || []}
            onChange={patchOpportunities}
          />
          <Professors
            professors={university.professors || []}
            onChange={patchProfessors}
          />
        </div>
      </div>
    </div>
  );
}
