'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { School, Search, Plus, Loader2, MapPin, Users, X } from 'lucide-react';

interface SchoolData {
    id: string;
    name: string;
    country: string;
    region: string;
    city: string;
    type: 'public' | 'private' | 'international' | 'other';
    verified: boolean;
    student_count: number;
}

export default function SchoolSelectionPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userCountry, setUserCountry] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [showAddSchool, setShowAddSchool] = useState(false);
    const [error, setError] = useState('');

    // Add school form state
    const [newSchool, setNewSchool] = useState({
        name: '',
        country: '',
        region: '',
        city: '',
        type: 'public' as 'public' | 'private' | 'international' | 'other'
    });

    useEffect(() => {
        // Get authenticated user and their country
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/signup/student');
                return;
            }
            setUserId(user.id);

            // Get user's country from student_profile
            const { data: profile } = await supabase
                .from('student_profiles')
                .select('country')
                .eq('user_id', user.id)
                .single();

            if (profile?.country) {
                setUserCountry(profile.country);
                setNewSchool(prev => ({ ...prev, country: profile.country }));
            }
        };

        getUser();
    }, [router, supabase]);

    useEffect(() => {
        // Fetch schools
        const fetchSchools = async () => {
            const { data, error } = await supabase
                .from('schools')
                .select('*')
                .eq('verified', true)
                .order('student_count', { ascending: false });

            if (error) {
                console.error('Error fetching schools:', error);
            } else {
                setSchools(data || []);
                setFilteredSchools(data || []);
            }
        };

        fetchSchools();
    }, [supabase]);

    useEffect(() => {
        // Filter schools by search term
        if (searchTerm.trim() === '') {
            setFilteredSchools(schools);
        } else {
            const filtered = schools.filter(school =>
                school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSchools(filtered);
        }
    }, [searchTerm, schools]);

    // Get schools from user's country
    const userCountrySchools = filteredSchools.filter(s => s.country === userCountry);
    const otherSchools = filteredSchools.filter(s => s.country !== userCountry);

    const handleAddSchool = async () => {
        if (!newSchool.name || !newSchool.country || !newSchool.city) {
            setError('Please fill in school name, country, and city');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Create new school
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .insert({
                    name: newSchool.name,
                    country: newSchool.country,
                    region: newSchool.region || null,
                    city: newSchool.city,
                    type: newSchool.type,
                    verified: false, // Needs admin verification
                    created_by: userId,
                    student_count: 1
                })
                .select()
                .single();

            if (schoolError) throw schoolError;

            // Award "School Pioneer!" achievement (10 points)
            try {
                await supabase.rpc('award_achievement', {
                    p_user_id: userId,
                    p_achievement_name: 'School Pioneer!'
                });
            } catch (err) {
                console.error('Error awarding achievement:', err);
            }

            // Select the newly created school
            setSelectedSchool(schoolData.id);
            setShowAddSchool(false);

            // Refresh schools list
            setSchools(prev => [...prev, schoolData]);

            // Show success message
            alert('🎉 School added! You earned the "School Pioneer!" achievement (10 points)');
        } catch (err: any) {
            console.error('Error adding school:', err);
            setError(err.message || 'Failed to add school');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!selectedSchool) {
            setError('Please select a school or skip this step');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Update student profile with school
            const { error: profileError } = await supabase
                .from('student_profiles')
                .upsert({
                    user_id: userId,
                    school_id: selectedSchool,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (profileError) throw profileError;

            // Update onboarding step
            await supabase
                .from('users')
                .update({ onboarding_step: 3 })
                .eq('id', userId);

            // Track analytics
            await supabase.from('onboarding_analytics').insert({
                user_id: userId,
                step: 3,
                step_name: 'school',
                completed_at: new Date().toISOString()
            });

            // Redirect to exam board selection
            router.push('/auth/onboarding/exam-board');
        } catch (err: any) {
            console.error('School selection error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        if (!userId) return;

        // Update onboarding step without selecting school
        await supabase
            .from('users')
            .update({ onboarding_step: 3 })
            .eq('id', userId);

        router.push('/auth/onboarding/exam-board');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-3xl relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 font-medium">Step 3 of 6</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                            <School className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Select Your School
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Connect with classmates and get personalized recommendations
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Search bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for your school..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Add School Button */}
                    <button
                        onClick={() => setShowAddSchool(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 text-green-700 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Can&apos;t find your school? Add it here
                    </button>

                    {/* Schools list */}
                    <div className="max-h-96 overflow-y-auto space-y-4">
                        {/* User's country schools */}
                        {userCountry && userCountrySchools.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Schools in {userCountry}
                                </h3>
                                <div className="space-y-2">
                                    {userCountrySchools.map((school) => (
                                        <button
                                            key={school.id}
                                            onClick={() => setSelectedSchool(school.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${selectedSchool === school.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{school.name}</h4>
                                                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {school.city}, {school.region || school.country}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {school.student_count} students
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${school.type === 'private' ? 'bg-purple-100 text-purple-700' :
                                                    school.type === 'international' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {school.type}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other schools */}
                        {otherSchools.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Other Schools
                                </h3>
                                <div className="space-y-2">
                                    {otherSchools.slice(0, 10).map((school) => (
                                        <button
                                            key={school.id}
                                            onClick={() => setSelectedSchool(school.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${selectedSchool === school.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{school.name}</h4>
                                                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {school.city}, {school.country}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {school.student_count} students
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${school.type === 'private' ? 'bg-purple-100 text-purple-700' :
                                                    school.type === 'international' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {school.type}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredSchools.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <School className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No schools found</p>
                                <p className="text-sm">Try a different search or add your school</p>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                        >
                            Skip for Now
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || !selectedSchool}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <span className="text-xl">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Go back
                    </button>
                </div>
            </div>

            {/* Add School Modal */}
            {showAddSchool && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add Your School</h2>
                            <button
                                onClick={() => setShowAddSchool(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    School Name *
                                </label>
                                <input
                                    type="text"
                                    value={newSchool.name}
                                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                                    placeholder="e.g., Alliance High School"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value={newSchool.country}
                                    onChange={(e) => setNewSchool({ ...newSchool, country: e.target.value })}
                                    placeholder="e.g., Kenya"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region/Province
                                </label>
                                <input
                                    type="text"
                                    value={newSchool.region}
                                    onChange={(e) => setNewSchool({ ...newSchool, region: e.target.value })}
                                    placeholder="e.g., Nairobi"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={newSchool.city}
                                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                                    placeholder="e.g., Kikuyu"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    School Type
                                </label>
                                <select
                                    value={newSchool.type}
                                    onChange={(e) => setNewSchool({ ...newSchool, type: e.target.value as any })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="international">International</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>🏆 Earn "School Pioneer!" achievement</strong><br />
                                    Be the first to add your school and earn 10 points!
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddSchool(false)}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSchool}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Add School
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
