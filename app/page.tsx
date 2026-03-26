"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Menu, Plus, Trash2, Home, Printer } from 'lucide-react';
import Image from 'next/image';

const districts = [
    { hindi: "बोकारो", english: "Bokaro" }, { hindi: "चतरा", english: "Chatra" },
    { hindi: "देवघर", english: "DEOGHAR" }, { hindi: "धनबाद", english: "Dhanbad" },
    { hindi: "दुमका", english: "Dumka" }, { hindi: "पूर्वी सिंहभूम", english: "East Singhbhum" },
    { hindi: "गढ़वा", english: "Garhwa" }, { hindi: "गिरिडीह", english: "Giridih" },
    { hindi: "गोड्डा", english: "Godda" }, { hindi: "गुमला", english: "Gumla" },
    { hindi: "हज़ारीबाग", english: "Hazaribagh" }, { hindi: "जामताड़ा", english: "Jamtara" },
    { hindi: "खूंटी", english: "Khunti" }, { hindi: "कोडरमा", english: "Koderma" },
    { hindi: "लातेहार", english: "Latehar" }, { hindi: "लोहरदगा", english: "Lohardaga" },
    { hindi: "पाकुड़", english: "Pakur" }, { hindi: "पलामू", english: "Palamu" },
    { hindi: "रामगढ़", english: "Ramgarh" }, { hindi: "रांची", english: "Ranchi" },
    { hindi: "साहिबगंज", english: "Sahibganj" }, { hindi: "सरायकेला खरसावां", english: "Seraikela-Kharsawan" },
    { hindi: "सिमडेगा", english: "Simdega" }, { hindi: "पश्चिमी सिंहभूम", english: "West Singhbhum" }
];

type Member = {
    id: number;
    name: string;
    gender: string;
    age: string;
    relation: string;
};

type FormData = {
    rationNo: string;
    nameHindi: string;
    nameEnglish: string;
    fatherName: string;
    districtHindi: string;
    districtEnglish: string;
    block: string;
    village: string;
    dealer: string;
    cardType: string;
    members: Member[];
};

const initialFormData: FormData = {
    rationNo: '', nameHindi: '', nameEnglish: '', fatherName: '', districtHindi: '',
    districtEnglish: '', block: '', village: '', dealer: '', cardType: 'PH Card (Red/pink Card)',
    members: []
};

export default function PDSPrintCard() {
    const [view, setView] = useState<'form' | 'preview'>('form');
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState('');
    const [isPage1, setIsPage1] = useState(true);
    const [showColor, setShowColor] = useState(false);
    const [scale, setScale] = useState(1);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateScaling() {
            if (!containerRef.current || view !== 'preview') return;
            const containerWidth = containerRef.current.offsetWidth;
            const cardWidth = 800; 
            
            if (containerWidth < cardWidth) {
                const newScale = (containerWidth / cardWidth) - 0.05;
                setScale(newScale);
            } else {
                setScale(1);
            }
        }

        window.addEventListener('resize', updateScaling);
        // Small delay to ensure DOM is ready
        setTimeout(updateScaling, 50);
        return () => window.removeEventListener('resize', updateScaling);
    }, [view]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (id: number, field: keyof Member, value: string) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.map(m => m.id === id ? { ...m, [field]: value } : m)
        }));
    };

    const addMember = () => {
        setFormData(prev => ({
            ...prev,
            members: [...prev.members, { id: Date.now(), name: '', gender: 'पु.', age: '', relation: '' }]
        }));
    };

    const removeMember = (id: number) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(m => m.id !== id)
        }));
    };

    const fillDemoData = () => {
        setFormData({
            rationNo: '202000940048',
            nameHindi: 'हसनबाबू बीबी',
            nameEnglish: 'HASNBABU BIBI',
            fatherName: 'MAKBUL MIYAN',
            districtHindi: 'देवघर',
            districtEnglish: 'DEOGHAR',
            block: 'PALOJORI',
            village: 'POKHARIA',
            dealer: 'LAKHENDAR MURMU',
            cardType: 'PH Card (Red/pink Card)',
            members: [
                { id: 1, name: 'हदीस मियाँ', gender: 'पु.', age: '77', relation: 'अन्य' },
                { id: 2, name: 'हसमवानु बीबी', gender: 'म.', age: '57', relation: 'स्वयं' },
                { id: 3, name: 'अब्दुल कुद्दुस', gender: 'पु.', age: '35', relation: 'बेटा' },
                { id: 4, name: 'परिषमा खातुन', gender: 'म.', age: '30', relation: 'बहु' },
                { id: 5, name: 'राजबानू खातून', gender: 'म.', age: '28', relation: 'बेटी' },
                { id: 6, name: 'सफाउद्दीन अंसारी', gender: 'पु.', age: '25', relation: 'बेटा' },
                { id: 7, name: 'इसरत जहां खातून', gender: 'म.', age: '13', relation: 'पोती' }
            ]
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.rationNo.length !== 12) {
            setError("Ration Card Number must be exactly 12 digits.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setShowColor(formData.cardType === 'Green Card');
        setView('preview');
        setIsPage1(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrint = () => {
        try {
            if (window.self !== window.top) {
                setShowPrintModal(true);
            } else {
                window.print();
            }
        } catch (e) {
            setShowPrintModal(true);
        }
    };

    const cardBgClass = showColor ? 'bg-[#e8f5e9]' : 'bg-white';
    const typeLabel = formData.cardType === 'Green Card' ? 'ग्रीन गृहस्थी योजना' : 'पूर्वविक्ताप्राप्त गृहस्थी योजना';

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f4f8] font-sans text-black">
            {/* Navbar */}
            <header className="bg-[#3b82f6] text-white shadow-md sticky top-0 z-[100] print:hidden">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-bold text-2xl">
                        <CreditCard className="w-7 h-7" />
                        <span>PDS Print Card</span>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
            </header>

            {/* Form View */}
            {view === 'form' && (
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 print:hidden">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-blue-50 p-6 border-b border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">You Print Ration Card</h1>
                                <p className="text-gray-500 mt-1">Enter details to generate your printable ration card format</p>
                            </div>
                            <button type="button" onClick={fillDemoData} className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold shadow-sm cursor-pointer">
                                Fill Demo Data
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Ration Card Number</label>
                                    <input type="text" name="rationNo" value={formData.rationNo} onChange={handleInputChange} placeholder="202000940048" required maxLength={12} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Cardholder Name (Hindi)</label>
                                    <input type="text" name="nameHindi" value={formData.nameHindi} onChange={handleInputChange} placeholder="हसनबाबू बीबी" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Cardholder Name (English)</label>
                                    <input type="text" name="nameEnglish" value={formData.nameEnglish} onChange={handleInputChange} placeholder="HASNBABU BIBI" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Father/Husband Name</label>
                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="MAKBUL MIYAN" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">जिला का नाम (हिंदी में)</label>
                                    <select name="districtHindi" value={formData.districtHindi} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-blue-500">
                                        <option value="">जिला चुनें</option>
                                        {districts.map(d => <option key={d.hindi} value={d.hindi}>{d.hindi}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">District Name (English)</label>
                                    <select name="districtEnglish" value={formData.districtEnglish} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-blue-500">
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.english} value={d.english}>{d.english}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Block</label>
                                    <input type="text" name="block" value={formData.block} onChange={handleInputChange} placeholder="PALOJORI" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Village / Ward</label>
                                    <input type="text" name="village" value={formData.village} onChange={handleInputChange} placeholder="POKHARIA" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Dealer Name</label>
                                    <input type="text" name="dealer" value={formData.dealer} onChange={handleInputChange} placeholder="LAKHENDAR MURMU" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Card Type</label>
                                    <select name="cardType" value={formData.cardType} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-blue-500">
                                        <option value="PH Card (Red/pink Card)">PH Card (Red/pink Card)</option>
                                        <option value="Green Card">Green Card</option>
                                        <option value="AAY Card (Yellow Card)">AAY Card (Yellow Card)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">Family Members Details</h2>
                                    <button type="button" onClick={addMember} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors cursor-pointer">
                                        <Plus className="w-4 h-4" /> Add Member
                                    </button>
                                </div>
                                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead className="bg-gray-50 text-gray-600 text-[10px] uppercase font-bold tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 border-b">Name</th>
                                                <th className="px-4 py-3 border-b">Gender</th>
                                                <th className="px-4 py-3 border-b">Age</th>
                                                <th className="px-4 py-3 border-b">Relation</th>
                                                <th className="px-4 py-3 border-b text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {formData.members.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <input type="text" value={member.name} onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)} required className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-blue-500" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select value={member.gender} onChange={(e) => handleMemberChange(member.id, 'gender', e.target.value)} className="w-full px-2 py-1 border rounded text-sm bg-white outline-none focus:border-blue-500">
                                                            <option value="पु.">पु.</option>
                                                            <option value="म.">म.</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="number" value={member.age} onChange={(e) => handleMemberChange(member.id, 'age', e.target.value)} required className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-blue-500" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="text" value={member.relation} onChange={(e) => handleMemberChange(member.id, 'relation', e.target.value)} required className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-blue-500" />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button type="button" onClick={() => removeMember(member.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {formData.members.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No members added yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#2563eb] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                                Generate Print Format
                            </button>
                        </form>
                    </div>
                </main>
            )}

            {/* Preview View */}
            {view === 'preview' && (
                <div id="preview-view" ref={containerRef} className="min-h-screen py-10 px-0 flex flex-col items-center bg-[#f8f9fa] overflow-x-hidden relative">
                    
                    {/* Top Action Bar */}
                    <div className="bg-white rounded-[16px] shadow-sm border border-gray-200 p-6 mb-10 w-[90%] max-w-3xl flex justify-center gap-6 print:hidden z-10 mx-auto mt-2">
                        <button onClick={() => setView('form')} className="bg-[#3b82f6] text-white px-8 py-3 rounded-[12px] shadow hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-bold text-xl flex-1 cursor-pointer">
                            <Home className="w-6 h-6" /> Edit Details
                        </button>
                        <button onClick={handlePrint} className="bg-[#16a34a] text-white px-8 py-3 rounded-[12px] shadow hover:bg-green-600 transition-all flex items-center justify-center gap-2 font-bold text-xl flex-1 cursor-pointer">
                            <Printer className="w-6 h-6" /> Print Card
                        </button>
                    </div>

                    {/* Scaling Wrapper */}
                    <div 
                        id="card-scaling-wrapper" 
                        className="flex flex-col items-center gap-10 origin-top transition-transform duration-300 print:scale-100 print:m-0 z-0 text-black"
                        style={{ transform: `scale(${scale})`, height: scale !== 1 ? `${700 * scale}px` : 'auto' }}
                    >
                        
                        {/* --- PAGE 1 LAYOUT --- */}
                        <div id="page1-layout" className={`flex gap-8 print:gap-6 ${!isPage1 ? 'hidden print:flex' : ''}`}>
                            {/* Left Panel */}
                            <div className={`card-panel-1 border-[3px] border-black flex flex-col relative overflow-hidden pt-8 px-6 print:border-[3px] shadow-lg print:shadow-none ${cardBgClass}`}>
                                <div className="text-center text-[13px] font-bold mb-4 leading-[1.4] tracking-wide">
                                    सामाजिक-आर्थिक एवं जाति जनगणना - २०२२<br/>के आलोक में पारिवारिक सूची
                                </div>
                                
                                <div className="border border-black w-[96%] mx-auto text-center py-1.5 mb-2 text-[10px] font-bold">
                                    RATION CARD NO. / राशन कार्ड संख्या : <span>{formData.rationNo}</span>
                                </div>

                                <table className="w-[96%] mx-auto border-collapse border border-black text-[12px] font-semibold">
                                    <thead>
                                        <tr>
                                            <th className="border border-black py-1 px-1 w-8 text-center font-bold">क्र.</th>
                                            <th className="border border-black py-1 px-1 text-center font-bold">पूरा नाम</th>
                                            <th className="border border-black py-1 px-1 w-10 text-center font-bold">लिंग</th>
                                            <th className="border border-black py-1 px-1 w-10 text-center font-bold">उम्र</th>
                                            <th className="border border-black py-1 px-1 w-14 text-center font-bold">संबंध</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.members.map((member, index) => (
                                            <tr key={member.id}>
                                                <td className="border border-black py-0.5 px-1 text-center font-bold">{index + 1}</td>
                                                <td className="border border-black py-0.5 px-1 text-center font-bold">{member.name}</td>
                                                <td className="border border-black py-0.5 px-1 text-center font-bold">{member.gender}</td>
                                                <td className="border border-black py-0.5 px-1 text-center font-bold">{member.age}</td>
                                                <td className="border border-black py-0.5 px-1 text-center font-bold">{member.relation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={5} className="border border-black py-1 px-4 font-bold text-left">
                                                कुल व्यक्तियों की संख्या : {formData.members.length}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5} className="border border-black py-1 px-4 font-bold text-left h-7">
                                                कार्डधारी का हस्ताक्षर :
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                {!showColor && (
                                    <div className="watermark-preview absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-35deg]">
                                        <div className="text-4xl font-black text-red-600 border-8 border-red-600 p-4 whitespace-nowrap">PREVIEW MODE</div>
                                    </div>
                                )}

                                <div className="text-center text-[9px] font-bold absolute bottom-8 left-0 right-0 tracking-wide leading-tight">
                                    HELP LINE NO:- 18003456598<br/>
                                    IT SUPPORT BY NATIONAL INFORMATICS CENTRE ( NIC )
                                </div>
                            </div>

                            {/* Right Panel */}
                            <div className={`card-panel-1 border-[3px] border-black flex flex-col relative overflow-hidden text-center pt-3 px-8 print:border-[3px] shadow-lg print:shadow-none ${cardBgClass}`}>
                                <h2 className="text-[20px] font-bold tracking-wide">राशन कार्ड</h2>
                                <p className="text-[14px] font-bold mt-3">खाद्य, सार्वजनिक वितरण एवं उपभोक्ता मामले विभाग</p>
                                
                                {/* Exact User Logo */}
                                <div className="relative w-40 h-40 mx-auto my-6">
                                    <Image 
                                        src="https://i.ibb.co/ZRZc1vfs/1280px-Jharkhand-Rajakiya-Chihna-svg.png" 
                                        alt="Jharkhand Logo" 
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>

                                <p className="text-[13px] font-bold mt-2">राष्ट्रीय खाद्य सुरक्षा अधिनियम</p>
                                <p className="text-[13px] font-bold mt-1 mb-4">{typeLabel} - {formData.districtEnglish.toUpperCase()}</p>

                                <div className="border border-black w-[90%] mx-auto text-center py-1.5 mt-2 text-[10px] font-bold">
                                    RATION CARD NO. / राशन कार्ड संख्या : <span>{formData.rationNo}</span>
                                </div>

                                <p className="text-[13px] font-bold mt-5 mb-2">कार्डधारी का नाम : {formData.nameHindi}</p>

                                {/* Barcode */}
                                <div className="mt-1 w-[200px] h-[30px] mx-auto opacity-95" style={{background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 6px, transparent 6px, transparent 8px, #000 8px, #000 12px, transparent 12px, transparent 14px, #000 14px, #000 15px, transparent 15px, transparent 18px, #000 18px, #000 20px, transparent 20px, transparent 22px)'}}></div>

                                {!showColor && (
                                    <div className="watermark-payment absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-35deg]">
                                        <div className="text-4xl font-black text-blue-600 border-8 border-blue-600 p-4 whitespace-nowrap text-center">PAY TO PRINT<br/>WATERMARK</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- PAGE 2 LAYOUT --- */}
                        <div id="page2-layout" className={`flex gap-8 print:gap-6 ${isPage1 ? 'hidden print:flex' : ''}`}>
                            {/* Page 2 Left Panel */}
                            <div className={`card-panel-2 border-[3px] border-black flex flex-col relative overflow-hidden pt-8 px-0 print:border-[3px] shadow-lg print:shadow-none ${cardBgClass}`}>
                                
                                <div className="border border-black w-[90%] mx-auto text-center py-1.5 mb-6 text-[10px] font-bold tracking-wide">
                                    RATION CARD NO. / राशन कार्ड संख्या : <span>{formData.rationNo}</span>
                                </div>

                                <div className="w-[90%] mx-auto space-y-3 text-[11px] font-bold flex-1">
                                    <div className="leading-tight">
                                        <div>1. CARDHOLDER NAME :{formData.nameEnglish.toUpperCase()}</div>
                                        <div>2. कार्डधारी का नाम : {formData.nameHindi}</div>
                                    </div>

                                    <div className="font-normal text-[11px] leading-tight text-justify pt-1 pb-1">
                                        ( वरिष्ठ महिला का नाम )<br/>
                                        ( गृहस्थी का मुखिया 18 वर्ष या उससे अधिक की महिला होगी | यदि 18 वर्ष से कम उम्र की महिलाएँ हो तो पुरुष गृहस्थी का मुखिया होगा | जैसे ही 18 वर्ष महिला की उम्र होगी वह गृहस्थी की मुखिया हो जायेगी )
                                    </div>

                                    <div>3. पिता / पति का नाम : <span className="text-[10px]">{formData.fatherName.toUpperCase()}</span></div>

                                    <div className="pt-1">
                                        4. आवासीय पता :-
                                        <div className="ml-10 font-bold mt-1.5 space-y-1 text-[11px]">
                                            <div>गाँव / वार्ड : <span className="text-[10px]">{formData.village.toUpperCase()}</span></div>
                                            <div>प्रखंड / नगर-पालिका : <span className="text-[10px]">{formData.block.toUpperCase()}</span></div>
                                            <div>जिला का नाम : <span className="text-[10px]">{formData.districtEnglish.toUpperCase()}</span></div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        5. लक्षित जन वितरण प्रणाली के दुकानदार का नाम / पता :-
                                        <div className="ml-10 font-bold mt-1.5 space-y-1 text-[11px]">
                                            <div>वितरण का नाम : <span className="text-[10px]">{formData.dealer.toUpperCase()}</span></div>
                                            <div>वितरण का पता : <span className="text-[10px]">{formData.districtEnglish.toUpperCase()}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between absolute bottom-12 left-[5%] right-[5%] font-bold text-[11px]">
                                    <span>निर्गत करने की तिथि</span>
                                    <span>प्राधिकृत अधिकारी का हस्ताक्षर</span>
                                </div>

                                {!showColor && (
                                    <div className="watermark-preview absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-35deg]">
                                        <div className="text-4xl font-black text-red-600 border-8 border-red-600 p-4 whitespace-nowrap">PREVIEW MODE</div>
                                    </div>
                                )}
                            </div>

                            {/* Page 2 Right Panel */}
                            <div className={`card-panel-2 border-[3px] border-black flex flex-col relative overflow-hidden pt-8 px-0 print:border-[3px] shadow-lg print:shadow-none ${cardBgClass}`}>
                                <h3 className="text-center font-bold text-[14px] mb-6 underline underline-offset-2">कार्डधारियों के लिए आवश्यक सूचनाएँ</h3>
                                
                                <div className="w-[90%] mx-auto space-y-4 text-[10px] font-medium text-justify leading-snug tracking-tight">
                                    <div className="flex gap-2"><span className="shrink-0">१.</span><span>यह राशनकार्ड, कार्डधारी को निजी रुप से दिया गया है। इसे कार्डधारी के अलावा कोई और व्यवहार में नहीं ला सकता है। कार्ड को सुरक्षित रखना कार्डधारी की निजी ज़िम्मेदारी है।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">२.</span><span>प्राधिकृत उचित मूल्य के दुकान से राशन लेने के समय कार्ड में राशन की मात्रा अवश्य अंकित करा लें। अपने कार्ड को दुकान में किसी भी हालत में नहीं छोड़ना चाहिये।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">३.</span><span>किसी भी माह का राशन अगर उसी माह में नहीं प्राप्त किया जाये तो वह राशन अगले महीने में भी मिल सकता है।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">४.</span><span>उचित मूल्य के दुकानदारों के विरुद्ध यदि कोई शिकायत हो तो उसकी सूचना उपायुक्त / उपविकास आयुक्त/ अनुमंडल पदाधिकारी / जिला आपूर्ति पदाधिकारी / पणन पदाधिकारी / प्रखण्ड आपूर्ति पदाधिकारी / आपूर्ति निरीक्षक को भेजी जा सकती है।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">५.</span><span>इस कार्ड का निर्धारित मूल्य है। इसके खो जाने या अन्य कारणों से दुसरे कार्ड की आवश्यकता पड़ने पर इसकी आपूर्ति निर्धारित राशि प्राप्त होने के उपरान्त, उचित जांच के बाद अनुमंडल पदाधिकारी / प्रखण्ड आपूर्ति पदाधिकारी के कार्यालय से प्राप्त की जा सकेगी।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">६.</span><span>कार्डधारी अगर अपने निवास स्थान को बदलने तो इसकी सूचना अनुमंडल पदाधिकारी / जिला आपूर्ति पदाधिकारी / प्रखण्ड आपूर्ति पदाधिकारी/ आपूर्ति निरीक्षक को तुरंत दे और अपने नये निवास के वार्ड की दुकान में अपना कार्ड स्थानान्तरित करवा ले ।</span></div>
                                    
                                    <div className="flex gap-2"><span className="shrink-0">७.</span><span>जब कार्डधारी का अपने राशनिंग क्षेत्र / अपने क्षेत्र के बाहर जाना निश्चित हो जाय तब इस राशन कार्ड को तुरंत अनुमंडल पदाधिकारी / आपूर्ति कार्यालय में समर्पित कर एक प्रमाणपत्र ले लेना आवश्यक होगा अन्यथा अन्य स्थान में नया कार्ड नहीं बन सकेगा ।</span></div>
                                </div>

                                {!showColor && (
                                    <div className="watermark-payment absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-35deg]">
                                        <div className="text-4xl font-black text-blue-600 border-8 border-blue-600 p-4 whitespace-nowrap text-center">PAY TO PRINT<br/>WATERMARK</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Buttons */}
                        <div className="flex flex-col gap-3 w-[220px] mt-6 pb-12 print:hidden z-10 mx-auto">
                            <button className="bg-[#1e88e5] text-white py-2.5 rounded-md font-bold text-sm shadow hover:bg-blue-600 transition-all cursor-pointer">Make Payment</button>
                            <button onClick={() => setIsPage1(!isPage1)} className="bg-[#22c55e] text-white py-2.5 rounded-md font-bold text-sm shadow hover:bg-green-600 transition-all cursor-pointer">
                                {isPage1 ? "Show 2nd Page" : "Show 1nd Page"}
                            </button>
                            <button onClick={() => setShowColor(true)} className="bg-[#1e88e5] text-white py-2.5 rounded-md font-bold text-sm shadow hover:bg-blue-600 transition-all cursor-pointer">Enable Page Color</button>
                            <button onClick={() => setShowColor(false)} className="bg-[#1e88e5] text-white py-2.5 rounded-md font-bold text-sm shadow hover:bg-blue-600 transition-all cursor-pointer">Disable Page Color</button>
                        </div>
                    </div>

                    {/* Print Modal for iframe */}
                    {showPrintModal && (
                        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 print:hidden">
                            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Print Preview</h3>
                                <p className="text-gray-600 mb-6">
                                    Printing is restricted inside this preview window. To print your card, please open the app in a new tab.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => {
                                            window.open(window.location.href, '_blank');
                                            setShowPrintModal(false);
                                        }}
                                        className="w-full bg-[#3b82f6] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                                    >
                                        Open in New Tab
                                    </button>
                                    <button 
                                        onClick={() => setShowPrintModal(false)}
                                        className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
