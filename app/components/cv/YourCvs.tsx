// components/cv/YourCvs.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { CvListSkeleton } from '../ui/SkeletonLoader';

interface CvSummary { _id: string; fullName: string; titles: string[]; updatedAt: string; }

function YourCvsContent() {
  const [cvs, setCvs] = useState<CvSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAndFetchUser = async () => {
      let uid = searchParams.get('userId');
      if (!uid) {
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const u = JSON.parse(stored);
            uid = u._id || u.id || null;
          }
        } catch (e) {}
      }
      
      setResolvedUserId(uid);

      if (!uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/cvs/user/${uid}`, {
          headers: { 'x-user-id': uid }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setCvs(data.data);
      } catch (error) {
        console.error("Failed to fetch user's CVs:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAndFetchUser();
  }, [searchParams]);

  const handleDelete = async (cvId: string) => {
    if (!resolvedUserId) return;
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        const res = await fetch(`/api/cvs/${cvId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': resolvedUserId }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        setCvs(prev => prev.filter(cv => cv._id !== cvId));
      } catch (error) {
        console.error('Failed to delete CV', error);
        alert('An error occurred while deleting the CV.');
      }
    }
  };

  if (loading) return <CvListSkeleton />;
  if (!resolvedUserId) {
    return <p className="text-center text-red-500 font-semibold mt-10">Please Login to view and create your CVs.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Created CVs</h2>
        <Link href={`/cv/create?userId=${resolvedUserId}`} className="bg-[#6C5DD3] hover:bg-[#5b4eb3] text-white px-5 py-2.5 rounded-lg shadow-lg shadow-[#6C5DD3]/20 flex items-center gap-2 text-[14px] font-bold cursor-pointer transition-all">
          <PlusCircle size={16} /> Create New
        </Link>
      </div>
      {cvs.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-gray-100 rounded-xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">You haven&apos;t created any CVs yet.</p>
          <p className="text-sm text-gray-400 mt-1">Start by creating your first professional resume</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {cvs.map(cv => (
            <div key={cv._id} className="group relative bg-white p-6 rounded-xl border border-gray-100 hover:border-[#6C5DD3]/30 hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all duration-300 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center text-[#6C5DD3] font-bold text-xl">
                    {cv.fullName ? cv.fullName.charAt(0).toUpperCase() : 'CV'}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/cv/${cv._id}?userId=${resolvedUserId}`} 
                      className="p-2.5 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/5 rounded-lg transition-all"
                      title="Edit CV"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(cv._id)} 
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete CV"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#1A1D1F] line-clamp-1 mb-1">{cv.fullName || "Untitled CV"}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                  {cv.titles && cv.titles.length > 0 ? cv.titles.join(' | ') : 'No titles added yet'}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Updated {new Date(cv.updatedAt).toLocaleDateString()}
                </span>
                <Link 
                  href={`/cv/${cv._id}?userId=${resolvedUserId}`}
                  className="text-[#6C5DD3] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Edit <Edit size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function YourCvs() {
  return (
    <Suspense fallback={<CvListSkeleton />}>
      <YourCvsContent />
    </Suspense>
  )
}