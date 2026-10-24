"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Pagination from '../Pagination/Pagination';

const VICE_PRESIDENT = ['Vice President', 'उपाध्यक्ष'];
const JOINT_SECRETARY = ['Joint Secretary', 'संयुक्त मंत्री'];
const ORGANISATION_SECRETARY = ['Organisation Secretary', 'संगठन मंत्री'];
const INTERNAL_AUDITOR = ['Internal Auditor', 'आंतरिक अंकेक्षक'];

const executiveMembers = [
  // Office bearers (shown with their post instead of a district)
  { name: "Shri Mahendra Sahu", role: VICE_PRESIDENT, mobile: "9431890742", image: "/assets/mahendra-sahu.jpg" },
  { name: "Shri Bhim Kumar Sahu", role: VICE_PRESIDENT, mobile: "9122820033", image: "/assets/bhim-kumar-sahu.jpg" },
  { name: "Sahu Bhupal Bharti", role: VICE_PRESIDENT, mobile: "9934613153", image: "/assets/bhupal-bharti-v2.jpg" },
  { name: "Shri Sanjay Sao", role: VICE_PRESIDENT, mobile: "9431227027", image: "/assets/sanjay-sao.jpg" },
  { name: "Shri Ram Charitra Sahu", role: VICE_PRESIDENT, mobile: "9123101589", image: "/assets/ram-charitra-sahu.jpg" },
  { name: "Shrimati Rekha Gupta", role: ['Treasurer', 'कोषाध्यक्ष'], mobile: "7488937858", image: "/assets/rekha-gupta.jpg" },
  { name: "Shri Manoj Kumar Sahu", role: JOINT_SECRETARY, mobile: "7004598450", image: "/assets/manoj-kumar-sahu.jpg" },
  { name: "Shri Kumar Digvijay Sunil", role: JOINT_SECRETARY, mobile: "9431245626", image: "/assets/kumar-digvijay-sunil.jpg" },
  { name: "Shri Mukesh Kumar", role: ORGANISATION_SECRETARY, mobile: "9709779465" },
  { name: "Shri Sanjeev Shekhar Gupta", role: ORGANISATION_SECRETARY, mobile: "7352137420" },
  { name: "Shri Arjun Prasad", role: INTERNAL_AUDITOR, mobile: "9334531252" },
  { name: "Shri Pradeep Kumar", role: INTERNAL_AUDITOR, mobile: "8809291488" },
  { name: "Shri Hiralal Sahu", district: ['Tirhut', 'तिरहुत'], mobile: "7765937654", image: "/assets/hiralal-sahu.jpg" },
  { name: "Shri Ranjit Sahu", district: ['Bhagalpur', 'भागलपुर'], mobile: "9771512170" },
  { name: "Shri Satya Narayan Sahu", district: ['Darbhanga', 'दरभंगा'], mobile: "9835454139" },
  { name: "Shri Satyanarayan Sahu", district: ['Saharsa', 'सहरसा'], mobile: "6200701594" },
  { name: "Shri Manoj Kumar", district: ['Munger', 'मुंगेर'], mobile: "7004414405", image: "/assets/manoj-kumar.jpg" },
  { name: "Shri Rajan Prasad Gupta", district: ['Saran', 'सारण'], mobile: "9123436336", image: "/assets/rajan-prasad-gupta.jpg" },
  { name: "Shri Rakesh Kumar Sahu", district: ['Purnia', 'पूर्णिया'], mobile: "8789484042" },
  { name: "Shri Chhotan Sahu", district: ['Magadh', 'मगध'], mobile: "9006214490", image: "/assets/chhotan-sahu.jpg" },
  { name: "Shri Vipul Kumar", district: ['Patna', 'पटना'], mobile: "8210703879", image: "/assets/vipul-kumar.jpg" },
  { name: "Shri Mayanand Sahu", district: ['Madhepura', 'मधेपुरा'], mobile: "7739726062" },
  { name: "Shri Balram Sahu (Advocate)", district: ['Madhubani', 'मधुबनी'], mobile: "9931789314" },
  { name: "Shri Vipin Gupta", district: ['Kaimur', 'कैमूर'], mobile: "7717731365" },
  { name: "Shri Virendra Prasad Gupta", district: ['Rohtas', 'रोहतास'], mobile: "8084878543" },
];

const advisoryMembers = [
  { name: "Dr. Dharmshila Gupta", title: ['Rajya Sabha MP', 'राज्यसभा सांसद'], mobile: "9304110287" },
  { name: "Shri Shivanandan Prasad", title: ['Former State President, Retired Income Tax Commissioner, New Delhi', 'पूर्व प्रदेश अध्यक्ष, सेवानिवृत्त आयकर आयुक्त, नई दिल्ली'], mobile: "9818105975" },
  { name: "Dr. C. N. Gupta", title: ['Former MLA & Former President, State Assembly', 'पूर्व विधायक एवं पूर्व अध्यक्ष, विधानसभा'], mobile: "9431218881" },
  { name: "Shri Sunil Kumar Pintu", title: ['MLA & Former MP', 'विधायक एवं पूर्व सांसद'], mobile: "9431241051" },
  { name: "Shri Ramnarayan Mandal", title: ['MLA', 'विधायक'], mobile: "9473192725" },
  { name: "Shri Narayan Prasad Sahu", title: ['Minister, Disaster Management Department, Bihar', 'मंत्री, आपदा प्रबंधन विभाग, बिहार'], mobile: "9939587607" },
  { name: "Dr. Ramchandra Prasad", title: ['Minister, Environment, Forest and Climate Change', 'मंत्री, पर्यावरण, वन एवं जलवायु परिवर्तन'], mobile: "9801394977" },
  { name: "Shri Lalbabu Prasad Gupta", title: ['MLA', 'विधायक'], mobile: "8002753890" },
  { name: "Shrimati Sangeeta Devi", title: ['MLA', 'विधायक'], mobile: "6203330862" },
  { name: "Shri Sanjay Kumar Gupta", title: ['Former MLA', 'पूर्व विधायक'], mobile: "9431813367" },
  { name: "Shri Gunjeshwar Sah", title: ['Former MLA', 'पूर्व विधायक'], mobile: "9431810418" },
  { name: "Shri Motilal Prasad", title: ['Former MLA', 'पूर्व विधायक'], mobile: "9472285099" },
  { name: "Shri Lalbabu Prasad", title: ['Former Legislative Council Member', 'पूर्व विधान पार्षद'], mobile: "9431212330" },
  { name: "Shri Ramjeevan Prasad Sah", title: ['Former MLA', 'पूर्व विधायक'], mobile: "9199180852" },
  { name: "Shri Vidyanand Prasad", title: ['Patna', 'पटना'], mobile: "9431268094" },
  { name: "Prof. Mahendra Prasad", title: ['Muzaffarpur', 'मुज़फ़्फ़रपुर'], mobile: "9835875775" },
  { name: "Shri Vijay Shankar Prasad", title: ['Khagaria', 'खगड़िया'], mobile: "9430483339" },
  { name: "Shrimati Shakuntala Sahu", title: ['Wife of Late Ramdev Sahu, Patna', 'धर्मपत्नी स्व. रामदेव साहू, पटना'], mobile: "9708000901" },
];

const committeeChairpersons = [
  { name: "Shri Ranvijay Sahu", committee: ['Building Construction Committee', 'भवन निर्माण समिति'], mobile: "9386153874", image: "/assets/president.jpg" },
  { name: "Shri Bimal Kishore Bittu", committee: ['Art and Culture Operations Committee', 'कला एवं संस्कृति संचालन समिति'], mobile: "9304327556", image: "/assets/bimal-square.jpg" },
  { name: "Shri Amardeep Kumar alias Pappu", committee: ['Meritorious Poor Students & Helpless Upliftment Committee', 'मेधावी निर्धन छात्र एवं असहाय उत्थान समिति'], mobile: "9304770969" },
  { name: "Er. Pramod Kumar", committee: ['Yoga and Intellectual Committee', 'योग एवं बौद्धिक समिति'], mobile: "9835213555" },
  { name: "Shri Raghunath Sah", committee: ['Building Operations Committee', 'भवन संचालन समिति'], mobile: "9934891806" },
  { name: "Dr. Arvind Sahu", committee: ['Hostel Operations Committee', 'छात्रावास संचालन समिति'], mobile: "9934964745" },
  { name: "Shrimati Preeti Saha", committee: ['Matrimonial Relations Committee', 'वैवाहिक संबंध समिति'], mobile: "9334121693" },
  { name: "Shri Suraj Kumar", committee: ['Social Security Committee', 'सामाजिक सुरक्षा समिति'], mobile: "9334165722" },
  { name: "Shri Sunil Kumar", committee: ['Disaster Management Cell', 'आपदा प्रबंधन प्रकोष्ठ'], mobile: "9304379058" },
  { name: "Shri Mahesh Chandra Diwakar", committee: ['Industry Cell', 'उद्योग प्रकोष्ठ'], mobile: "9308087517" },
  { name: "Shri Manoj Kumar Gupta", committee: ['Municipal Committee', 'नगर निकाय समिति'], mobile: "9431421075" },
  { name: "Shri Pramod Kumar (Advocate)", committee: ['Income Tax & GST Committee', 'आयकर एवं जीएसटी समिति'], mobile: "9386705543" },
  { name: "Dr. Praveen Sahu", committee: ['Health Committee', 'स्वास्थ्य समिति'], mobile: "9006633325" },
  { name: "Prof. Ramchandra Sahu", committee: ['Acharya Shyam Nandan Shastri Library', 'आचार्य श्याम नंदन शास्त्री पुस्तकालय'], mobile: "9431004963" },
  { name: "Shri Mahendra Sahu", committee: ['Cultural & Heritage Conservation Committee', 'सांस्कृतिक एवं विरासत संरक्षण समिति'], mobile: "8789881244" },
  { name: "Dr. Deepak Kumar Gupta", committee: ['Technical Education Committee', 'तकनीकी शिक्षा समिति'], mobile: "9311299375" },
  { name: "Shri Jiya Lal Prasad Dinkar", committee: ['Banking Service Committee', 'बैंकिंग सेवा समिति'], mobile: "9507511667" },
  { name: "Dr. Sanjay Kumar", committee: ['Social Dispute Resolution Committee', 'सामाजिक विवाद निवारण समिति'], mobile: "9304121041" },
  { name: "Prof. Avinash Ranjan", committee: ['Teacher Service Committee', 'शिक्षक सेवा समिति'], mobile: "8507585826" },
  { name: "Shri Dhanraj Prasad", committee: ['Farmers Committee', 'किसान समिति'], mobile: "9430008875" },
  { name: "Shri Kundan Kumar Gupta", committee: ['Student Committee', 'छात्र समिति'], mobile: "9507511667" },
  { name: "Er. Shailendra Prasad Gupta", committee: ['Planning and Student Welfare Committee', 'योजना एवं छात्र कल्याण समिति'], mobile: "9234776292" },
  { name: "Shri Raju Kumar Gupta", committee: ['Interstate Relations Committee', 'अंतरराज्यीय संबंध समिति'], mobile: "9323924118" },
  { name: "Shri Ashok Chandra alias Laat Sahab", committee: ['Retail Trade Committee', 'खुदरा व्यापार समिति'], mobile: "9334078400" },
  { name: "Shri Rameshwar Prasad Sah", committee: ['Employee Service Committee', 'कर्मचारी सेवा समिति'], mobile: "9431847989" },
  { name: "Shri Vijay Kumar (Advocate)", committee: ['Law and Justice Committee', 'विधि एवं न्याय समिति'], mobile: "9934844793" },
  { name: "Shri Avadhesh Gupta (Former Mukhiya)", committee: ['Panchayati Raj Committee', 'पंचायती राज समिति'], mobile: "9801689642" },
  { name: "Shri Virendra Kumar Sahu", committee: ['Administrative Committee', 'प्रशासनिक समिति'], mobile: "9801518585" },
  { name: "Shri Vishwanath Gupta", committee: ['Census Committee', 'जनगणना समिति'], mobile: "9852118267" },
  { name: "Shri Umesh Kumar Gupta", committee: ['Commerce and Trade Cell', 'वाणिज्य एवं व्यापार प्रकोष्ठ'], mobile: "9934887736" },
  { name: "Shri Rajesh Kumar", committee: ['Spokesperson & Media In-charge', 'प्रवक्ता एवं मीडिया प्रभारी'], mobile: "9334208224" },
  { name: "Shri Shailesh Narayan Sah", committee: ['Bandhu Patrika Management Committee', 'बंधु पत्रिका प्रबंधन समिति'] },
];

// From the Sabha's list "जिला अध्यक्ष/कार्यकारी/संयोजक/प्रभारी की सूची"
const districtCommittee = [
  { district: ["Patna Mahanagar", "पटना महानगर"], head: ["Shri Sanjeet Kumar", "श्री संजीत कुमार"], headMobiles: ["9835608831", "7909088290"], incharge: ["Shri Pradeep Kumar & Shri Sanjeev Shekhar Gupta", "श्री प्रदीप कुमार सह श्री संजीव शेखर गुप्ता"], inchargeMobiles: ["8809291488", "7352137420"] },
  { district: ["Patna East", "पटना पूर्वी"], head: ["Shri Sanjay Sao", "श्री संजय साव"], headMobiles: ["8434692826"], incharge: ["Shri Amardeep Kumar alias Pappu", "श्री अमरदीप कुमार उर्फ पप्पू"], inchargeMobiles: ["9304770969"] },
  { district: ["Patna West Rural", "पटना पश्चिमी ग्रामीण"], head: ["Shri Sulendra Prasad Gupta", "श्री सुलेन्द्र प्रसाद गुप्ता"], headMobiles: ["7991150765", "9608049081"], incharge: ["Smt. Simmi Pr. & Shri Vipul Kumar", "श्रीमती सिम्मी प्र. सह श्री विपुल कुमार"], inchargeMobiles: ["9798470411", "8210703879"] },
  { district: ["Vaishali", "वैशाली"], head: ["Shri Anil Sah", "श्री अनिल साह"], headMobiles: ["8434551000", "9431026101"], incharge: ["Shri Vinay Kumar alias Guddu Sah", "श्री विनय कुमार उर्फ गुड्डू साह"], inchargeMobiles: ["9852274574", "8340370501"] },
  { district: ["Saran", "सारण"], head: ["Shri Brahmdev Narayan Gyani", "श्री ब्रह्मदेव नारायण ज्ञानी"], headMobiles: ["9199038596"], incharge: ["Shri Aditya Sah", "श्री आदित्य साह"], inchargeMobiles: ["9798852444"] },
  { district: ["Siwan", "सीवान"], head: ["Shri Arun Ku. Gupta", "श्री अरुण कु. गुप्ता"], headMobiles: ["9006680450"], incharge: ["Shri Gautam Sah", "श्री गौतम साह"], inchargeMobiles: ["9006527573"] },
  { district: ["Gopalganj", "गोपालगंज"], head: ["Shri Arvind Kumar alias Pappu", "श्री अरविन्द कुमार उर्फ पप्पू"], headMobiles: ["9006120085", "9431059452"], incharge: ["Shri Rajan Prasad Gupta", "श्री राजन प्रसाद गुप्ता"], inchargeMobiles: ["9123436336"] },
  { district: ["Bhojpur", "भोजपुर"], head: ["Shri Shiv Kumar Sah", "श्री शिव कुमार साह"], headMobiles: ["8757590219"], incharge: ["Shri Bhim Kumar Sahu", "श्री भीम कुमार साहू"], inchargeMobiles: ["9122820033"] },
  { district: ["Buxar", "बक्सर"], head: ["Shri Anant Prasad", "श्री अनन्त प्रसाद"], headMobiles: ["8651793534", "9470411689"], incharge: ["Dr. Rajendra Prasad (Maniyara)", "डॉ. राजेन्द्र प्रसाद (मनियारा)"], inchargeMobiles: ["9934970566"] },
  { district: ["Kaimur", "कैमूर"], head: ["Shri Jilendra Kumar alias Munna Pr. Gupta", "श्री जिलेन्द्र कुमार उर्फ मुन्ना प्र. गुप्ता"], headMobiles: ["7979947550"], incharge: ["Shri Virendra Prasad Gupta", "श्री विरेन्द्र प्रसाद गुप्ता"], inchargeMobiles: ["8084878543"] },
  { district: ["Rohtas", "रोहतास"], head: ["Shri Ram Chandra Prasad", "श्री राम चन्द्र प्रसाद"], headMobiles: ["9801199743"], incharge: ["Shri Vipin Gupta", "श्री विपीन गुप्ता"], inchargeMobiles: ["7717731365"] },
  { district: ["Aurangabad", "औरंगाबाद"], head: ["Shri Uday Kumar Gupta", "श्री उदय कुमार गुप्ता"], headMobiles: ["9801125295"], incharge: ["Shri Bimal Kishore Bittu", "श्री विमल किशोर विट्टु"], inchargeMobiles: ["9304327556"] },
  { district: ["Gaya", "गया"], head: ["Shri Ajay Kumar", "श्री अजय कुमार"], headMobiles: ["8084636175"], incharge: ["Smt. Rekha Kumari", "श्रीमती रेखा कुमारी"], inchargeMobiles: ["7488937858"] },
  { district: ["Nawada", "नवादा"], head: ["Shri Jitendra Kumar", "श्री जीतेन्द्र कुमार"], headMobiles: ["9431409563"], incharge: ["Shri Chhotan Sah", "श्री छोटन साह"], inchargeMobiles: ["9006214490"] },
  { district: ["Jehanabad", "जहानाबाद"], head: ["Shri Shailesh Kumar", "श्री शैलेश कुमार"], headMobiles: ["8986006622", "9204271712"], incharge: ["Smt. Pushpa Gupta", "श्रीमती पुष्पा गुप्ता"], inchargeMobiles: ["8271668861"] },
  { district: ["Arwal", "अरवल"], head: ["Shri Ram Ishwar Sao", "श्री राम ईश्वर साव"], headMobiles: ["8340787184", "9939296542"], incharge: ["Shri Manoj Kumar Sahu", "श्री मनोज कुमार साहू"], inchargeMobiles: ["7004598450"] },
  { district: ["Nalanda", "नालन्दा"], head: ["Shri Dilip Kumar", "श्री दिलीप कुमार"], headMobiles: ["9835452357"], incharge: ["Shri Sanjay Sao", "श्री संजय साव"], inchargeMobiles: ["9431227027"] },
  { district: ["Sheikhpura", "शेखपुरा"], head: ["Shri Arun Sao (Bhagat Ji)", "श्री अरुण साव (भगत जी)"], headMobiles: ["9934200032"], incharge: ["Shri Mukesh Kumar", "श्री मुकेश कुमार"], inchargeMobiles: ["9709779465"] },
  { district: ["Lakhisarai", "लखीसराय"], head: ["Shri Ravindra Kumar", "श्री रविन्द्र कुमार"], headMobiles: ["7542099187"], incharge: ["Shri Umesh Kumar Gupta", "श्री उमेश कुमार गुप्ता"], inchargeMobiles: ["9934887736"] },
  { district: ["Jamui", "जमुई"], head: ["Dr. Neeraj Kumar", "डॉ. नीरज कुमार"], headMobiles: ["8292003640"], incharge: ["Shri Arjun Prasad", "श्री अर्जुन प्रसाद"], inchargeMobiles: ["9334531252"] },
  { district: ["Banka", "बाँका"], head: ["Shri Vinay Krishna", "श्री विनय कृष्ण"], headMobiles: ["9661715142"], incharge: ["Shri Ranjeet Sah", "श्री रंजीत साह"], inchargeMobiles: ["9771512170"] },
  { district: ["Bhagalpur", "भागलपुर"], head: ["Prof. Arvind Ku. Sah", "प्रो. अरविन्द कु. साह"], headMobiles: ["7542849831"], incharge: ["Shri Lalan Kumar Sah", "श्री ललन कुमार साह"], inchargeMobiles: ["9931887897"] },
  { district: ["Munger", "मुंगेर"], head: ["Shri Sanjay Ku. (Pappu Sah)", "श्री संजय कु. (पप्पू साह)"], headMobiles: ["9430449278"], incharge: ["Shri Manoj Kumar Mantu", "श्री मनोज कुमार मंटु"], inchargeMobiles: ["7004414405"] },
  { district: ["Katihar", "कटिहार"], head: ["Shri Vidyanand Gupta", "श्री विद्यानंद गुप्ता"], headMobiles: ["9430277320"], incharge: ["Shri Anjani Kumar Sah", "श्री अंजनी कुमार साह"], inchargeMobiles: ["8210433705"] },
  { district: ["Samastipur", "समस्तीपुर"], head: ["Shri Raj Kishore Sahu", "श्री राज किशोर साहु"], headMobiles: ["9631450400"], incharge: ["Shri Kumar Digvijay \"Sunil\"", "श्री कुमार दिग्विजय \"सुनील\""], inchargeMobiles: ["9431245626", "9334360626"] },
  { district: ["Darbhanga", "दरभंगा"], head: ["Shri Rambabu Sah", "श्री रामबाबु साह"], headMobiles: ["9472635711", "9570421900"], incharge: ["Shri Balram Sahu (Advocate)", "श्री बलराम साहू (अधिवक्ता)"], inchargeMobiles: ["9931789314"] },
  { district: ["Madhubani", "मधुबनी"], head: ["Shri Hiralal Sah", "श्री हीरालाल साह"], headMobiles: ["9708065594"], incharge: ["Shri Suresh Kumar Sahu", "श्री सुरेश कुमार साहू"], inchargeMobiles: ["8210311911"] },
  { district: ["Supaul", "सुपौल"], head: ["Shri Laxmikant Gupta", "श्री लक्ष्मीकान्त गुप्ता"], headMobiles: ["6202640529"], incharge: ["Shri Satish Kumar", "श्री सतीश कुमार"], inchargeMobiles: ["6206154390"] },
  { district: ["Saharsa", "सहरसा"], head: ["Shri Uday Chandra Sah", "श्री उदय चन्द्र साह"], headMobiles: ["9430695348"], incharge: ["Shri Mayanand Sah", "श्री मायानन्द साह"], inchargeMobiles: ["7739726062"] },
  { district: ["Madhepura", "मधेपुरा"], head: ["Shri Pradeep Kumar Sah", "श्री प्रदीप कुमार साह"], headMobiles: ["7717707539"], incharge: ["Shri Satya Narayan Sah", "श्री सत्य नारायण साह"], inchargeMobiles: ["6200701594"] },
  { district: ["Araria", "अररिया"], head: ["Shri Jay Prakash Sah", "श्री जय प्रकाश साह"], headMobiles: ["9341019823"], incharge: ["Shri Hira Lal Rahi", "श्री हीरा लाल राही"], inchargeMobiles: ["9955557042"] },
  { district: ["Purnia", "पूर्णिया"], head: ["Shri Sopal Sah", "श्री सोपाल साह"], headMobiles: ["9934258621"], incharge: ["Shri Mahendra Sahu", "श्री महेन्द्र साहू"], inchargeMobiles: ["9431890742"] },
  { district: ["Kishanganj", "किशनगंज"], head: ["Shri Pramod Kumar Pappu", "श्री प्रमोद कुमार पप्पू"], headMobiles: ["9470225898"], incharge: ["Shri Rakesh Kumar Sah", "श्री राकेश कुमार साह"], inchargeMobiles: ["8789484042"] },
  { district: ["Begusarai", "बेगुसराय"], head: ["Shri Prem Kumar", "श्री प्रेम कुमार"], headMobiles: ["9431203375"], incharge: ["Shri Manoj Kumar Gupta (Advocate)", "श्री मनोज कुमार गुप्ता (अधिवक्ता)"], inchargeMobiles: ["9431421075"] },
  { district: ["Khagaria", "खगड़िया"], head: ["Shri Sanjay Ku. Gupta", "श्री संजय कु. गुप्ता"], headMobiles: ["9430568537"], incharge: ["Shri Ramcharitra Sahu", "श्री रामचरित्र साहु"], inchargeMobiles: ["9123101589", "9835083919"] },
  { district: ["Muzaffarpur", "मुजफ्फरपुर"], head: ["Shri Jagannath Pr. Gupta", "श्री जगन्नाथ प्र. गुप्ता"], headMobiles: ["9835063455"], incharge: ["Shri Satya Narayan Sahu", "श्री सत्य नारायण साहू"], inchargeMobiles: ["9835454139"] },
  { district: ["Sheohar", "शिवहर"], head: ["Shri Virchand Prasad alias Biru", "श्री वीरचंद प्रसाद उर्फ बीरू"], headMobiles: ["9430526997", "9525222106"], incharge: ["Er. Shivnandan Prasad Sah", "ई. शिवनन्दन प्रसाद साह"], inchargeMobiles: ["9546222567"] },
  { district: ["Sitamarhi", "सीतामढी"], head: ["Shri Vinod Prasad", "श्री विनोद प्रसाद"], headMobiles: ["9934071422"], incharge: ["Prof. Banwari Lal", "प्रो. बनवारी लाल"], inchargeMobiles: ["9835097897"] },
  { district: ["East Champaran", "पूर्वी चम्पारण"], head: ["Shri Raghubar Prasad", "श्री रघुबर प्रसाद"], headMobiles: ["9117971151"], incharge: ["Shri Sahu Bhupal Bharti", "श्री साहू भूपाल भारती"], inchargeMobiles: ["9934613153"] },
  { district: ["West Champaran", "पश्चिमी चम्पारण"], head: ["Shri Alok Ku. Sah", "श्री आलोक कु. साह"], headMobiles: ["9102575701"], incharge: ["Shri Hira Lal Sah", "श्री हीरा लाल साह"], inchargeMobiles: ["7765937654"] },
  { district: ["Bagaha Police District", "बगहा पुलिस जिला"], head: ["Shri Dinesh Prasad", "श्री दिनेश प्रसाद"], headMobiles: ["7903051248"], incharge: ["Shri Naval Prasad Gupta (Netaji)", "श्री नवल प्रसाद गुप्ता (नेताजी)"], inchargeMobiles: ["9430439811"] },
];

const mahilaCommittee = [
  { name: "Sima Prasad", role: ["Mahila Adhyaksh (Women's President)", 'महिला अध्यक्ष'], mobile: "8709607778", image: "/assets/sima.jpeg" },
  { name: "Sheetal Gupta", role: ['Mahamantri (General Secretary, Mahila Morcha)', 'महामंत्री (महिला मोर्चा)'], mobile: "9973315777", image: "/assets/sheetal.jpg" },
  { name: "Rooplata", role: ['Koshadhyaksh (Treasurer, Mahila Morcha)', 'कोषाध्यक्ष (महिला मोर्चा)'], image: "/assets/rooplata.jpg" },
];

const PER_PAGE = 16;

const initials = (name) =>
  name
    .replace(/\(.*?\)/g, '')
    .replace(/^(Shri|Shrimati|Dr\.|Er\.|Prof\.)\s+/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const tabs = [
  { id: 'executive', label: ['Executive Members', 'कार्यकारिणी सदस्य'], count: executiveMembers.length },
  { id: 'advisory', label: ['Advisory Committee', 'सलाहकार समिति'], count: advisoryMembers.length },
  { id: 'committees', label: ['Committee Chairpersons', 'समिति अध्यक्ष'], count: committeeChairpersons.length },
  { id: 'district', label: ['District Committee', 'जिला समिति'], count: districtCommittee.length },
  { id: 'mahila', label: ['Mahila Committee', 'महिला समिति'], count: mahilaCommittee.length },
];

const ExecutiveCommittee = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [page, setPage] = useState(1);

  const lists = {
    executive: executiveMembers,
    advisory: advisoryMembers,
    committees: committeeChairpersons,
    district: districtCommittee,
    mahila: mahilaCommittee,
  };
  const activeList = lists[activeTab];
  const totalPages = Math.ceil(activeList.length / PER_PAGE);
  const pageStart = (page - 1) * PER_PAGE;
  const pageItems = (list) => list.slice(pageStart, pageStart + PER_PAGE);

  const selectTab = (id) => {
    setActiveTab(id);
    setPage(1);
  };

  const changePage = (next) => {
    setPage(next);
    document.getElementById('about-executive')?.scrollIntoView({ behavior: 'smooth' });
  };
  const { t } = useLanguage();

  return (
    <section id="about-executive" className="section-padding bg-[#FFFBF7]">
      <div className="px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">{t('Governance', 'शासन व्यवस्था')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('Executive Committee', 'कार्यकारिणी समिति')}</h2>
          <div className="w-16 h-1 bg-primary mb-4"></div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 flex-wrap mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-yellow-200 text-gray-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {t(...tab.label)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Executive Members */}
        {activeTab === 'executive' && (
          <motion.div
            key="executive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pageItems(executiveMembers).map((member, index) => (
              <PhotoCard key={index} member={member} subtitle={t(...(member.role || member.district))} />
            ))}
          </motion.div>
        )}

        {/* Advisory Committee */}
        {activeTab === 'advisory' && (
          <motion.div
            key="advisory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pageItems(advisoryMembers).map((member, index) => (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm hover:border-yellow-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-amber-700 font-bold text-sm">{member.name.split(' ')[1]?.charAt(0) || member.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">{member.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{t(...member.title)}</p>
                  <a
                    href={`tel:+91${member.mobile}`}
                    className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Phone size={10} /> {member.mobile}
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Committee Chairpersons */}
        {activeTab === 'committees' && (
          <motion.div
            key="committees"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pageItems(committeeChairpersons).map((member, index) => (
              <PhotoCard key={index} member={member} subtitle={t(...member.committee)} />
            ))}
          </motion.div>
        )}

        {/* District Committee */}
        {activeTab === 'district' && (
          <motion.div
            key="district"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {pageItems(districtCommittee).map((row, index) => (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-xl p-4 hover:shadow-sm hover:border-yellow-300 transition-all"
              >
                <p className="text-primary text-xs font-bold uppercase tracking-wide mb-3 leading-snug">
                  {pageStart + index + 1}. {t(...row.district)}
                </p>
                <div className="space-y-3">
                  <DistrictPerson
                    label={t('President / Working / Convener', 'अध्यक्ष / कार्यकारी / संयोजक')}
                    name={t(...row.head)}
                    mobiles={row.headMobiles}
                  />
                  <DistrictPerson
                    label={t('District In-charge', 'जिला प्रभारी')}
                    name={t(...row.incharge)}
                    mobiles={row.inchargeMobiles}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Mahila Adhyaksh */}
        {activeTab === 'mahila' && (
          <motion.div
            key="mahila"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pageItems(mahilaCommittee).map((member, index) => (
              <PhotoCard key={index} member={member} subtitle={t(...member.role)} />
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={activeList.length}
            perPage={PER_PAGE}
            onChange={changePage}
          />
        )}
      </div>
    </section>
  );
};

// Square portrait card with name, post and phone over a dark gradient; initials when there's no photo
function PhotoCard({ member, subtitle }) {
  return (
    <div className="relative aspect-square w-full max-w-sm mx-auto sm:max-w-none overflow-hidden rounded-2xl border border-yellow-200 shadow-sm">
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 384px, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          style={{ objectPosition: member.imagePosition || 'top' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 pb-16">
          <span className="text-5xl font-bold text-yellow-700/70">{initials(member.name)}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 pt-12">
        <h4 className="text-lg font-bold text-white leading-tight">{member.name}</h4>
        <p className="text-[#f5b301] text-sm mb-1 leading-snug">{subtitle}</p>
        {member.mobile && (
          <a
            href={`tel:+91${member.mobile}`}
            className="text-sm text-white/85 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Phone size={12} /> +91 {member.mobile.slice(0, 5)} {member.mobile.slice(5)}
          </a>
        )}
      </div>
    </div>
  );
}

function DistrictPerson({ label, name, mobiles }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <h4 className="font-bold text-gray-900 text-sm leading-snug">{name}</h4>
      <div className="flex flex-wrap gap-x-3 mt-0.5">
        {mobiles.map((mobile) => (
          <a
            key={mobile}
            href={`tel:+91${mobile}`}
            className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Phone size={10} /> {mobile}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ExecutiveCommittee;
