import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// bcrypt hash of "Password@123" at cost 12
const PASSWORD_HASH = '$2a$12$iV.RWTHPyOYKXagLsQyld.w1Sjogf4nnowSNpe/9yKJtwADq0lVla';

const d = (offset: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt;
};

async function main() {
  console.log('🌱  Starting seed...');

  await prisma.location.createMany({
    data: [
      { id:'loc_mumbai_01',    city:'Mumbai',    district:'Mumbai City',     state:'Maharashtra', country:'India', pincode:'400001', latitude:19.0760, longitude:72.8777 },
      { id:'loc_delhi_01',     city:'Delhi',     district:'New Delhi',       state:'Delhi',       country:'India', pincode:'110001', latitude:28.6139, longitude:77.2090 },
      { id:'loc_bengaluru_01', city:'Bangalore', district:'Bengaluru Urban', state:'Karnataka',   country:'India', pincode:'560001', latitude:12.9716, longitude:77.5946 },
      { id:'loc_chennai_01',   city:'Chennai',   district:'Chennai',         state:'Tamil Nadu',  country:'India', pincode:'600001', latitude:13.0827, longitude:80.2707 },
      { id:'loc_hyderabad_01', city:'Hyderabad', district:'Hyderabad',       state:'Telangana',   country:'India', pincode:'500001', latitude:17.3850, longitude:78.4867 },
      { id:'loc_pune_01',      city:'Pune',      district:'Pune',            state:'Maharashtra', country:'India', pincode:'411001', latitude:18.5204, longitude:73.8567 },
      { id:'loc_ahmedabad_01', city:'Ahmedabad', district:'Ahmedabad',       state:'Gujarat',     country:'India', pincode:'380001', latitude:23.0225, longitude:72.5714 },
      { id:'loc_kolkata_01',   city:'Kolkata',   district:'Kolkata',         state:'West Bengal', country:'India', pincode:'700001', latitude:22.5726, longitude:88.3639 },
      { id:'loc_jaipur_01',    city:'Jaipur',    district:'Jaipur',          state:'Rajasthan',   country:'India', pincode:'302001', latitude:26.9124, longitude:75.7873 },
      { id:'loc_surat_01',     city:'Surat',     district:'Surat',           state:'Gujarat',     country:'India', pincode:'395001', latitude:21.1702, longitude:72.8311 },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Locations');

  await prisma.skill.createMany({
    data: [
      { id:'skl_masonry',     name:'Masonry',            slug:'masonry',            category:'CONSTRUCTION',  description:'Brick and stone laying, plastering',           icon:'🧱' },
      { id:'skl_carpentry',   name:'Carpentry',          slug:'carpentry',          category:'CONSTRUCTION',  description:'Wood work, doors, windows, furniture',         icon:'🪚' },
      { id:'skl_plumbing',    name:'Plumbing',           slug:'plumbing',           category:'CONSTRUCTION',  description:'Pipe fitting, sanitation, water supply',       icon:'🔧' },
      { id:'skl_electrical',  name:'Electrical Work',    slug:'electrical-work',    category:'CONSTRUCTION',  description:'Wiring, installations, repairs',               icon:'⚡' },
      { id:'skl_painting',    name:'Painting',           slug:'painting',           category:'CONSTRUCTION',  description:'Interior and exterior painting',               icon:'🎨' },
      { id:'skl_welding',     name:'Welding',            slug:'welding',            category:'CONSTRUCTION',  description:'Metal welding, fabrication, cutting',          icon:'🔥' },
      { id:'skl_tiling',      name:'Tile Work',          slug:'tile-work',          category:'CONSTRUCTION',  description:'Floor and wall ceramic/vitrified tiling',      icon:'🏠' },
      { id:'skl_machine_op',  name:'Machine Operation',  slug:'machine-operation',  category:'MANUFACTURING', description:'Operating industrial machines and equipment',  icon:'⚙️' },
      { id:'skl_qc',          name:'Quality Control',    slug:'quality-control',    category:'MANUFACTURING', description:'QC inspection, testing, documentation',        icon:'✅' },
      { id:'skl_cooking',     name:'Cooking',            slug:'cooking',            category:'DOMESTIC',      description:'Food preparation, meal cooking',               icon:'👨‍🍳' },
      { id:'skl_housekeeping',name:'Housekeeping',       slug:'housekeeping',       category:'DOMESTIC',      description:'Cleaning, dusting, floor mopping',             icon:'🧹' },
      { id:'skl_gardening',   name:'Gardening',          slug:'gardening',          category:'DOMESTIC',      description:'Garden maintenance, landscaping',              icon:'🌿' },
      { id:'skl_driving',     name:'Driving',            slug:'driving',            category:'TRANSPORT',     description:'Vehicle driving (LMV/HMV)',                    icon:'🚗' },
      { id:'skl_loading',     name:'Loading/Unloading',  slug:'loading-unloading',  category:'TRANSPORT',     description:'Goods loading, unloading, stacking',           icon:'📦' },
      { id:'skl_pc_repair',   name:'Computer Repair',    slug:'computer-repair',    category:'TECHNOLOGY',    description:'Hardware and software troubleshooting',        icon:'💻' },
      { id:'skl_mob_repair',  name:'Mobile Repair',      slug:'mobile-repair',      category:'TECHNOLOGY',    description:'Smartphone hardware and software repair',      icon:'📱' },
      { id:'skl_farming',     name:'Farming',            slug:'farming',            category:'AGRICULTURE',   description:'Crop cultivation, ploughing, irrigation',      icon:'🌾' },
      { id:'skl_harvesting',  name:'Harvesting',         slug:'harvesting',         category:'AGRICULTURE',   description:'Crop harvesting, threshing',                   icon:'🌻' },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Skills');

  // Admins
  await prisma.user.createMany({
    data: [
      { id:'usr_admin_01', email:'superadmin@digitallabourchowk.com', phone:'+919900000001', passwordHash:PASSWORD_HASH, firstName:'Rajesh', lastName:'Kumar',   role:'SUPER_ADMIN',   status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_admin_02', email:'admin@digitallabourchowk.com',      phone:'+919900000002', passwordHash:PASSWORD_HASH, firstName:'Priya',  lastName:'Sharma',  role:'SUPER_ADMIN',   status:'ACTIVE', emailVerified:true, phoneVerified:true },
    ],
    skipDuplicates: true,
  });
  await prisma.admin.createMany({
    data: [
      { id:'adm_01', userId:'usr_admin_01', isSuperAdmin:true,  department:'Management' },
      { id:'adm_02', userId:'usr_admin_02', isSuperAdmin:false, department:'Operations' },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Admins');

  // Company Admins + Companies
  await prisma.user.createMany({
    data: [
      { id:'usr_ca_01', email:'amit.mehta@buildright.co.in',   phone:'+919800001001', passwordHash:PASSWORD_HASH, firstName:'Amit',  lastName:'Mehta',   role:'COMPANY_ADMIN', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_ca_02', email:'rekha.iyer@techbuild.in',        phone:'+919800002002', passwordHash:PASSWORD_HASH, firstName:'Rekha', lastName:'Iyer',    role:'COMPANY_ADMIN', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_ca_03', email:'vinod.chauhan@skilledhands.in',  phone:'+919800003003', passwordHash:PASSWORD_HASH, firstName:'Vinod', lastName:'Chauhan', role:'COMPANY_ADMIN', status:'ACTIVE', emailVerified:true, phoneVerified:true },
    ],
    skipDuplicates: true,
  });
  await prisma.company.createMany({
    data: [
      { id:'cmp_01', name:'BuildRight Construction Pvt Ltd', slug:'buildright-construction', registrationNo:'CIN-U45200MH2015PTC123456', gstNumber:'27AAACB1234A1Z5', panNumber:'AAACB1234A', email:'info@buildright.co.in',  phone:'+912267890000', website:'https://buildright.co.in',  description:'Leading construction company in Maharashtra',              isVerified:true, verifiedAt:new Date(), employeeCount:250, establishedYear:2015, locationId:'loc_mumbai_01' },
      { id:'cmp_02', name:'TechBuild Infrastructure Ltd',    slug:'techbuild-infrastructure',  registrationNo:'CIN-U45200DL2018PTC987654', gstNumber:'07AAACT9876B1Z3', panNumber:'AAACT9876B', email:'contact@techbuild.in',   phone:'+911123456789', website:'https://techbuild.in',      description:'Smart infrastructure and technology-driven construction',  isVerified:true, verifiedAt:new Date(), employeeCount:180, establishedYear:2018, locationId:'loc_delhi_01' },
      { id:'cmp_03', name:'SkilledHands Staffing Solutions', slug:'skilledhands-staffing',      registrationNo:'CIN-U74900KA2020PTC456789', gstNumber:'29AAACS4567C1Z1', panNumber:'AAACS4567C', email:'hr@skilledhands.in',     phone:'+918023456789', website:'https://skilledhands.in',   description:'Premium labour staffing and workforce management',          isVerified:true, verifiedAt:new Date(), employeeCount:500, establishedYear:2020, locationId:'loc_bengaluru_01' },
    ],
    skipDuplicates: true,
  });
  await prisma.companyAdmin.createMany({
    data: [
      { id:'ca_01', userId:'usr_ca_01', companyId:'cmp_01', isPrimary:true },
      { id:'ca_02', userId:'usr_ca_02', companyId:'cmp_02', isPrimary:true },
      { id:'ca_03', userId:'usr_ca_03', companyId:'cmp_03', isPrimary:true },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Companies');

  // Contractors
  await prisma.user.createMany({
    data: [
      { id:'usr_con_01', email:'suresh.patil@contractor.com',  phone:'+919811001001', passwordHash:PASSWORD_HASH, firstName:'Suresh',   lastName:'Patil',  role:'CONTRACTOR', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_con_02', email:'anita.desai@contractor.com',   phone:'+919811002002', passwordHash:PASSWORD_HASH, firstName:'Anita',    lastName:'Desai',  role:'CONTRACTOR', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_con_03', email:'mo.khan@contractor.com',        phone:'+919811003003', passwordHash:PASSWORD_HASH, firstName:'Mohammed', lastName:'Khan',   role:'CONTRACTOR', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_con_04', email:'sunita.reddy@contractor.com',  phone:'+919811004004', passwordHash:PASSWORD_HASH, firstName:'Sunita',   lastName:'Reddy',  role:'CONTRACTOR', status:'ACTIVE', emailVerified:true, phoneVerified:true },
      { id:'usr_con_05', email:'vikram.singh@contractor.com',  phone:'+919811005005', passwordHash:PASSWORD_HASH, firstName:'Vikram',   lastName:'Singh',  role:'CONTRACTOR', status:'ACTIVE', emailVerified:true, phoneVerified:true },
    ],
    skipDuplicates: true,
  });
  await prisma.contractor.createMany({
    data: [
      { id:'con_01', userId:'usr_con_01', companyId:'cmp_01', specializations:['Civil Construction','RCC Work'],      licenseNumber:'MH-CONT-2019-001', licenseExpiry:new Date('2027-12-31'), rating:4.8, totalRatings:38, totalProjectsDone:45, locationId:'loc_mumbai_01',    isVerified:true, verifiedAt:new Date() },
      { id:'con_02', userId:'usr_con_02', companyId:'cmp_02', specializations:['Interior Design','Renovation'],       licenseNumber:'DL-CONT-2020-002', licenseExpiry:new Date('2026-06-30'), rating:4.6, totalRatings:27, totalProjectsDone:32, locationId:'loc_delhi_01',     isVerified:true, verifiedAt:new Date() },
      { id:'con_03', userId:'usr_con_03', companyId:'cmp_01', specializations:['Electrical','Solar Installation'],    licenseNumber:'KA-CONT-2018-003', licenseExpiry:new Date('2028-03-31'), rating:4.9, totalRatings:60, totalProjectsDone:67, locationId:'loc_bengaluru_01', isVerified:true, verifiedAt:new Date() },
      { id:'con_04', userId:'usr_con_04', companyId:'cmp_03', specializations:['Plumbing','Sanitation'],              licenseNumber:'TN-CONT-2021-004', licenseExpiry:new Date('2025-09-30'), rating:4.5, totalRatings:22, totalProjectsDone:28, locationId:'loc_chennai_01',   isVerified:true, verifiedAt:new Date() },
      { id:'con_05', userId:'usr_con_05', companyId:'cmp_02', specializations:['HVAC','Mechanical Work'],             licenseNumber:'TS-CONT-2022-005', licenseExpiry:new Date('2026-12-31'), rating:4.7, totalRatings:15, totalProjectsDone:19, locationId:'loc_hyderabad_01', isVerified:true, verifiedAt:new Date() },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Contractors');

  // Workers
  await prisma.user.createMany({
    data: [
      { id:'usr_wkr_01', phone:'+919700001001', passwordHash:PASSWORD_HASH, firstName:'Ramesh',   lastName:'Yadav',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_02', phone:'+919700001002', passwordHash:PASSWORD_HASH, firstName:'Kavitha',  lastName:'Nair',    role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_03', phone:'+919700001003', passwordHash:PASSWORD_HASH, firstName:'Arun',     lastName:'Kumar',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_04', phone:'+919700001004', passwordHash:PASSWORD_HASH, firstName:'Lakshmi',  lastName:'Devi',    role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_05', phone:'+919700001005', passwordHash:PASSWORD_HASH, firstName:'Santosh',  lastName:'Gupta',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_06', phone:'+919700001006', passwordHash:PASSWORD_HASH, firstName:'Meena',    lastName:'Patel',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_07', phone:'+919700001007', passwordHash:PASSWORD_HASH, firstName:'Dinesh',   lastName:'Rawat',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_08', phone:'+919700001008', passwordHash:PASSWORD_HASH, firstName:'Pooja',    lastName:'Mishra',  role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_09', phone:'+919700001009', passwordHash:PASSWORD_HASH, firstName:'Rajendra', lastName:'Thakur',  role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_10', phone:'+919700001010', passwordHash:PASSWORD_HASH, firstName:'Suman',    lastName:'Bai',     role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_11', phone:'+919700001011', passwordHash:PASSWORD_HASH, firstName:'Manoj',    lastName:'Tiwari',  role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_12', phone:'+919700001012', passwordHash:PASSWORD_HASH, firstName:'Geeta',    lastName:'Sharma',  role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_13', phone:'+919700001013', passwordHash:PASSWORD_HASH, firstName:'Prakash',  lastName:'Verma',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_14', phone:'+919700001014', passwordHash:PASSWORD_HASH, firstName:'Ritu',     lastName:'Soni',    role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_15', phone:'+919700001015', passwordHash:PASSWORD_HASH, firstName:'Harish',   lastName:'Chandra', role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_16', phone:'+919700001016', passwordHash:PASSWORD_HASH, firstName:'Ananya',   lastName:'Joshi',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_17', phone:'+919700001017', passwordHash:PASSWORD_HASH, firstName:'Deepak',   lastName:'Pandey',  role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_18', phone:'+919700001018', passwordHash:PASSWORD_HASH, firstName:'Nirmala',  lastName:'Singh',   role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_19', phone:'+919700001019', passwordHash:PASSWORD_HASH, firstName:'Bharat',   lastName:'Lal',     role:'WORKER', status:'ACTIVE', phoneVerified:true },
      { id:'usr_wkr_20', phone:'+919700001020', passwordHash:PASSWORD_HASH, firstName:'Sarla',    lastName:'Devi',    role:'WORKER', status:'ACTIVE', phoneVerified:true },
    ],
    skipDuplicates: true,
  });
  await prisma.worker.createMany({
    data: [
      { id:'wkr_01', userId:'usr_wkr_01', gender:'MALE',   languages:['Hindi','Marathi'],     availableForWork:true,  dailyRate:800,  experienceYears:8,  locationId:'loc_mumbai_01',    city:'Mumbai',    state:'Maharashtra', rating:4.5, totalRatings:120, totalJobsDone:156, isProfileComplete:true },
      { id:'wkr_02', userId:'usr_wkr_02', gender:'FEMALE', languages:['Malayalam','Hindi'],   availableForWork:true,  dailyRate:550,  experienceYears:5,  locationId:'loc_chennai_01',   city:'Chennai',   state:'Tamil Nadu',  rating:4.8, totalRatings:175, totalJobsDone:203, isProfileComplete:true },
      { id:'wkr_03', userId:'usr_wkr_03', gender:'MALE',   languages:['Kannada','English'],   availableForWork:false, dailyRate:1000, experienceYears:10, locationId:'loc_bengaluru_01', city:'Bangalore', state:'Karnataka',   rating:4.9, totalRatings:290, totalJobsDone:312, isProfileComplete:true },
      { id:'wkr_04', userId:'usr_wkr_04', gender:'FEMALE', languages:['Telugu','Hindi'],      availableForWork:true,  dailyRate:480,  experienceYears:3,  locationId:'loc_hyderabad_01', city:'Hyderabad', state:'Telangana',   rating:4.3, totalRatings:78,  totalJobsDone:89,  isProfileComplete:false },
      { id:'wkr_05', userId:'usr_wkr_05', gender:'MALE',   languages:['Hindi','Punjabi'],     availableForWork:true,  dailyRate:900,  experienceYears:12, locationId:'loc_delhi_01',     city:'Delhi',     state:'Delhi',       rating:4.7, totalRatings:410, totalJobsDone:445, isProfileComplete:true },
      { id:'wkr_06', userId:'usr_wkr_06', gender:'FEMALE', languages:['Gujarati','Hindi'],    availableForWork:true,  dailyRate:520,  experienceYears:6,  locationId:'loc_pune_01',      city:'Pune',      state:'Maharashtra', rating:4.6, totalRatings:155, totalJobsDone:178, isProfileComplete:true },
      { id:'wkr_07', userId:'usr_wkr_07', gender:'MALE',   languages:['Hindi','Rajasthani'],  availableForWork:true,  dailyRate:1400, experienceYears:15, locationId:'loc_jaipur_01',    city:'Jaipur',    state:'Rajasthan',   rating:4.8, totalRatings:490, totalJobsDone:523, isProfileComplete:true },
      { id:'wkr_08', userId:'usr_wkr_08', gender:'FEMALE', languages:['Hindi','Bengali'],     availableForWork:false, dailyRate:580,  experienceYears:4,  locationId:'loc_kolkata_01',   city:'Kolkata',   state:'West Bengal', rating:4.4, totalRatings:120, totalJobsDone:134, isProfileComplete:false },
      { id:'wkr_09', userId:'usr_wkr_09', gender:'MALE',   languages:['Marathi','Hindi'],     availableForWork:true,  dailyRate:960,  experienceYears:9,  locationId:'loc_mumbai_01',    city:'Mumbai',    state:'Maharashtra', rating:4.7, totalRatings:240, totalJobsDone:267, isProfileComplete:true },
      { id:'wkr_10', userId:'usr_wkr_10', gender:'FEMALE', languages:['Gujarati','Hindi'],    availableForWork:true,  dailyRate:540,  experienceYears:7,  locationId:'loc_ahmedabad_01', city:'Ahmedabad', state:'Gujarat',     rating:4.5, totalRatings:192, totalJobsDone:211, isProfileComplete:true },
      { id:'wkr_11', userId:'usr_wkr_11', gender:'MALE',   languages:['Hindi','Bhojpuri'],    availableForWork:true,  dailyRate:750,  experienceYears:11, locationId:'loc_delhi_01',     city:'Delhi',     state:'Delhi',       rating:4.6, totalRatings:360, totalJobsDone:389, isProfileComplete:true },
      { id:'wkr_12', userId:'usr_wkr_12', gender:'FEMALE', languages:['Telugu','Tamil'],      availableForWork:true,  dailyRate:620,  experienceYears:8,  locationId:'loc_chennai_01',   city:'Chennai',   state:'Tamil Nadu',  rating:4.9, totalRatings:425, totalJobsDone:456, isProfileComplete:true },
      { id:'wkr_13', userId:'usr_wkr_13', gender:'MALE',   languages:['Kannada','English'],   availableForWork:false, dailyRate:1100, experienceYears:6,  locationId:'loc_bengaluru_01', city:'Bangalore', state:'Karnataka',   rating:4.5, totalRatings:178, totalJobsDone:192, isProfileComplete:true },
      { id:'wkr_14', userId:'usr_wkr_14', gender:'FEMALE', languages:['Gujarati','Hindi'],    availableForWork:true,  dailyRate:650,  experienceYears:4,  locationId:'loc_surat_01',     city:'Surat',     state:'Gujarat',     rating:4.3, totalRatings:62,  totalJobsDone:67,  isProfileComplete:false },
      { id:'wkr_15', userId:'usr_wkr_15', gender:'MALE',   languages:['Marathi','Hindi'],     availableForWork:true,  dailyRate:980,  experienceYears:20, locationId:'loc_pune_01',      city:'Pune',      state:'Maharashtra', rating:4.8, totalRatings:760, totalJobsDone:789, isProfileComplete:true },
      { id:'wkr_16', userId:'usr_wkr_16', gender:'FEMALE', languages:['Punjabi','Hindi'],     availableForWork:true,  dailyRate:450,  experienceYears:2,  locationId:'loc_delhi_01',     city:'Delhi',     state:'Delhi',       rating:4.2, totalRatings:30,  totalJobsDone:34,  isProfileComplete:false },
      { id:'wkr_17', userId:'usr_wkr_17', gender:'MALE',   languages:['Hindi','Bengali'],     availableForWork:true,  dailyRate:1200, experienceYears:13, locationId:'loc_kolkata_01',   city:'Kolkata',   state:'West Bengal', rating:4.7, totalRatings:324, totalJobsDone:348, isProfileComplete:true },
      { id:'wkr_18', userId:'usr_wkr_18', gender:'FEMALE', languages:['Hindi','Awadhi'],      availableForWork:false, dailyRate:400,  experienceYears:16, locationId:'loc_mumbai_01',    city:'Mumbai',    state:'Maharashtra', rating:4.6, totalRatings:490, totalJobsDone:512, isProfileComplete:true },
      { id:'wkr_19', userId:'usr_wkr_19', gender:'MALE',   languages:['Gujarati','Hindi'],    availableForWork:true,  dailyRate:820,  experienceYears:7,  locationId:'loc_ahmedabad_01', city:'Ahmedabad', state:'Gujarat',     rating:4.4, totalRatings:210, totalJobsDone:223, isProfileComplete:true },
      { id:'wkr_20', userId:'usr_wkr_20', gender:'FEMALE', languages:['Rajasthani','Hindi'],  availableForWork:true,  dailyRate:600,  experienceYears:10, locationId:'loc_jaipur_01',    city:'Jaipur',    state:'Rajasthan',   rating:4.7, totalRatings:314, totalJobsDone:334, isProfileComplete:true },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Workers (20)');

  await prisma.workerSkill.createMany({
    data: [
      { id:'ws_01_mas', workerId:'wkr_01', skillId:'skl_masonry',     level:'EXPERT',       yearsOfExperience:8,  isVerified:true },
      { id:'ws_01_til', workerId:'wkr_01', skillId:'skl_tiling',      level:'ADVANCED',     yearsOfExperience:5,  isVerified:true },
      { id:'ws_02_coo', workerId:'wkr_02', skillId:'skl_cooking',     level:'EXPERT',       yearsOfExperience:5,  isVerified:true },
      { id:'ws_02_hsk', workerId:'wkr_02', skillId:'skl_housekeeping',level:'ADVANCED',     yearsOfExperience:5,  isVerified:true },
      { id:'ws_03_ele', workerId:'wkr_03', skillId:'skl_electrical',  level:'EXPERT',       yearsOfExperience:10, isVerified:true },
      { id:'ws_03_pcr', workerId:'wkr_03', skillId:'skl_pc_repair',   level:'ADVANCED',     yearsOfExperience:4,  isVerified:true },
      { id:'ws_04_coo', workerId:'wkr_04', skillId:'skl_cooking',     level:'INTERMEDIATE', yearsOfExperience:3,  isVerified:false },
      { id:'ws_04_grd', workerId:'wkr_04', skillId:'skl_gardening',   level:'BEGINNER',     yearsOfExperience:1,  isVerified:false },
      { id:'ws_05_car', workerId:'wkr_05', skillId:'skl_carpentry',   level:'EXPERT',       yearsOfExperience:12, isVerified:true },
      { id:'ws_05_pnt', workerId:'wkr_05', skillId:'skl_painting',    level:'ADVANCED',     yearsOfExperience:8,  isVerified:true },
      { id:'ws_06_hsk', workerId:'wkr_06', skillId:'skl_housekeeping',level:'ADVANCED',     yearsOfExperience:6,  isVerified:true },
      { id:'ws_06_coo', workerId:'wkr_06', skillId:'skl_cooking',     level:'INTERMEDIATE', yearsOfExperience:4,  isVerified:false },
      { id:'ws_07_wel', workerId:'wkr_07', skillId:'skl_welding',     level:'EXPERT',       yearsOfExperience:15, isVerified:true },
      { id:'ws_07_mop', workerId:'wkr_07', skillId:'skl_machine_op',  level:'ADVANCED',     yearsOfExperience:10, isVerified:true },
      { id:'ws_08_coo', workerId:'wkr_08', skillId:'skl_cooking',     level:'INTERMEDIATE', yearsOfExperience:4,  isVerified:false },
      { id:'ws_08_hsk', workerId:'wkr_08', skillId:'skl_housekeeping',level:'INTERMEDIATE', yearsOfExperience:4,  isVerified:false },
      { id:'ws_08_grd', workerId:'wkr_08', skillId:'skl_gardening',   level:'BEGINNER',     yearsOfExperience:2,  isVerified:false },
      { id:'ws_09_plu', workerId:'wkr_09', skillId:'skl_plumbing',    level:'EXPERT',       yearsOfExperience:9,  isVerified:true },
      { id:'ws_09_til', workerId:'wkr_09', skillId:'skl_tiling',      level:'ADVANCED',     yearsOfExperience:6,  isVerified:true },
      { id:'ws_10_hsk', workerId:'wkr_10', skillId:'skl_housekeeping',level:'ADVANCED',     yearsOfExperience:7,  isVerified:true },
      { id:'ws_10_coo', workerId:'wkr_10', skillId:'skl_cooking',     level:'INTERMEDIATE', yearsOfExperience:5,  isVerified:false },
      { id:'ws_11_drv', workerId:'wkr_11', skillId:'skl_driving',     level:'EXPERT',       yearsOfExperience:11, isVerified:true },
      { id:'ws_11_lod', workerId:'wkr_11', skillId:'skl_loading',     level:'ADVANCED',     yearsOfExperience:8,  isVerified:true },
      { id:'ws_12_coo', workerId:'wkr_12', skillId:'skl_cooking',     level:'EXPERT',       yearsOfExperience:8,  isVerified:true },
      { id:'ws_12_hsk', workerId:'wkr_12', skillId:'skl_housekeeping',level:'EXPERT',       yearsOfExperience:8,  isVerified:true },
      { id:'ws_13_ele', workerId:'wkr_13', skillId:'skl_electrical',  level:'ADVANCED',     yearsOfExperience:6,  isVerified:true },
      { id:'ws_13_mob', workerId:'wkr_13', skillId:'skl_mob_repair',  level:'INTERMEDIATE', yearsOfExperience:3,  isVerified:false },
      { id:'ws_14_qc',  workerId:'wkr_14', skillId:'skl_qc',          level:'INTERMEDIATE', yearsOfExperience:4,  isVerified:false },
      { id:'ws_14_mop', workerId:'wkr_14', skillId:'skl_machine_op',  level:'INTERMEDIATE', yearsOfExperience:3,  isVerified:false },
      { id:'ws_15_mas', workerId:'wkr_15', skillId:'skl_masonry',     level:'EXPERT',       yearsOfExperience:20, isVerified:true },
      { id:'ws_15_pnt', workerId:'wkr_15', skillId:'skl_painting',    level:'EXPERT',       yearsOfExperience:15, isVerified:true },
      { id:'ws_15_til', workerId:'wkr_15', skillId:'skl_tiling',      level:'EXPERT',       yearsOfExperience:12, isVerified:true },
      { id:'ws_16_coo', workerId:'wkr_16', skillId:'skl_cooking',     level:'BEGINNER',     yearsOfExperience:2,  isVerified:false },
      { id:'ws_16_hsk', workerId:'wkr_16', skillId:'skl_housekeeping',level:'BEGINNER',     yearsOfExperience:1,  isVerified:false },
      { id:'ws_16_grd', workerId:'wkr_16', skillId:'skl_gardening',   level:'BEGINNER',     yearsOfExperience:1,  isVerified:false },
      { id:'ws_17_car', workerId:'wkr_17', skillId:'skl_carpentry',   level:'EXPERT',       yearsOfExperience:13, isVerified:true },
      { id:'ws_17_wel', workerId:'wkr_17', skillId:'skl_welding',     level:'ADVANCED',     yearsOfExperience:8,  isVerified:true },
      { id:'ws_18_frm', workerId:'wkr_18', skillId:'skl_farming',     level:'EXPERT',       yearsOfExperience:16, isVerified:true },
      { id:'ws_18_hrv', workerId:'wkr_18', skillId:'skl_harvesting',  level:'EXPERT',       yearsOfExperience:14, isVerified:true },
      { id:'ws_19_drv', workerId:'wkr_19', skillId:'skl_driving',     level:'ADVANCED',     yearsOfExperience:7,  isVerified:true },
      { id:'ws_19_mop', workerId:'wkr_19', skillId:'skl_machine_op',  level:'INTERMEDIATE', yearsOfExperience:4,  isVerified:false },
      { id:'ws_20_coo', workerId:'wkr_20', skillId:'skl_cooking',     level:'EXPERT',       yearsOfExperience:10, isVerified:true },
      { id:'ws_20_hsk', workerId:'wkr_20', skillId:'skl_housekeeping',level:'ADVANCED',     yearsOfExperience:8,  isVerified:true },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Worker Skills');

  await prisma.site.createMany({
    data: [
      { id:'ste_01', contractorId:'con_01', name:'Andheri Residential Complex',   description:'High-rise residential project in Andheri West',   address:'Plot 45, MIDC, Andheri West',      city:'Mumbai',    state:'Maharashtra', pincode:'400053', latitude:19.1234, longitude:72.8456, radiusMeters:300, isActive:true, totalWorkers:35 },
      { id:'ste_02', contractorId:'con_02', name:'Connaught Place Office Fit-out', description:'Interior renovation of heritage office building',  address:'Block D, Connaught Place',          city:'Delhi',     state:'Delhi',       pincode:'110001', latitude:28.6315, longitude:77.2167, radiusMeters:200, isActive:true, totalWorkers:22 },
      { id:'ste_03', contractorId:'con_03', name:'Whitefield Tech Park',           description:'Electrical infrastructure for new IT campus',      address:'Plot 12, EPIP Zone, Whitefield',    city:'Bangalore', state:'Karnataka',   pincode:'560066', latitude:12.9716, longitude:77.7499, radiusMeters:400, isActive:true, totalWorkers:48 },
      { id:'ste_04', contractorId:'con_04', name:'OMR Road Housing Project',       description:'Plumbing & sanitation for gated community',        address:'Survey No. 99, OMR Road',           city:'Chennai',   state:'Tamil Nadu',  pincode:'600097', latitude:12.9098, longitude:80.2267, radiusMeters:250, isActive:true, totalWorkers:18 },
      { id:'ste_05', contractorId:'con_05', name:'Gachibowli Commercial Tower',    description:'HVAC installation for 22-floor commercial tower',  address:'Survey No. 78, Gachibowli',         city:'Hyderabad', state:'Telangana',   pincode:'500032', latitude:17.4435, longitude:78.3489, radiusMeters:350, isActive:true, totalWorkers:29 },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Sites');

  // Jobs (50)
  await prisma.job.createMany({
    data: [
      {id:'job_01',contractorId:'con_01',siteId:'ste_01',title:'Senior Mason – High Rise Project',    skillCategory:'Construction',requiredSkillId:'skl_masonry',    workerCount:5, filledCount:2,dailyWage:900, weeklyWage:5500,jobType:'WEEKLY',  status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:245,publishedAt:d(-5),startDate:d(3), endDate:d(90)},
      {id:'job_02',contractorId:'con_01',siteId:'ste_01',title:'Tile Work Specialist',               skillCategory:'Construction',requiredSkillId:'skl_tiling',     workerCount:3, filledCount:1,dailyWage:800, weeklyWage:4800,jobType:'WEEKLY',  status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:189,publishedAt:d(-4),startDate:d(5), endDate:d(60)},
      {id:'job_03',contractorId:'con_01',siteId:null,    title:'Painting Supervisor',                skillCategory:'Construction',requiredSkillId:'skl_painting',   workerCount:2, filledCount:0,dailyWage:1200,weeklyWage:7000,jobType:'WEEKLY',  status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:true, viewCount:312,publishedAt:d(-2),startDate:d(1), endDate:d(45)},
      {id:'job_04',contractorId:'con_01',siteId:null,    title:'Carpenter – Modular Kitchen',        skillCategory:'Construction',requiredSkillId:'skl_carpentry',  workerCount:4, filledCount:0,dailyWage:950, weeklyWage:5800,jobType:'WEEKLY',  status:'PUBLISHED',city:'Pune',     state:'Maharashtra',isUrgent:false,viewCount:156,publishedAt:d(-6),startDate:d(7), endDate:d(75)},
      {id:'job_05',contractorId:'con_01',siteId:null,    title:'Plumber – High Rise',                skillCategory:'Construction',requiredSkillId:'skl_plumbing',   workerCount:3, filledCount:0,dailyWage:850, weeklyWage:5200,jobType:'WEEKLY',  status:'ACTIVE',   city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:201,publishedAt:d(-10),startDate:d(-3),endDate:d(60)},
      {id:'job_06',contractorId:'con_02',siteId:'ste_02',title:'Interior Renovation Carpenter',      skillCategory:'Construction',requiredSkillId:'skl_carpentry',  workerCount:6, filledCount:3,dailyWage:900, weeklyWage:5500,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:178,publishedAt:d(-3),startDate:d(2), endDate:d(50)},
      {id:'job_07',contractorId:'con_02',siteId:'ste_02',title:'Painter – Commercial Office',        skillCategory:'Construction',requiredSkillId:'skl_painting',   workerCount:4, filledCount:0,dailyWage:750, weeklyWage:4500,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:143,publishedAt:d(-4),startDate:d(3), endDate:d(40)},
      {id:'job_08',contractorId:'con_02',siteId:null,    title:'Electrician – Office Fitout',        skillCategory:'Construction',requiredSkillId:'skl_electrical', workerCount:5, filledCount:0,dailyWage:1000,weeklyWage:6000,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:true, viewCount:289,publishedAt:d(-1),startDate:d(2), endDate:d(55)},
      {id:'job_09',contractorId:'con_02',siteId:null,    title:'Mason – Boundary Wall',              skillCategory:'Construction',requiredSkillId:'skl_masonry',    workerCount:8, filledCount:0,dailyWage:700, weeklyWage:4200,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:98, publishedAt:d(-7),startDate:d(5), endDate:d(30)},
      {id:'job_10',contractorId:'con_02',siteId:null,    title:'Daily Labour – Demolition',          skillCategory:'Construction',requiredSkillId:null,             workerCount:10,filledCount:0,dailyWage:650, weeklyWage:3900,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:true, viewCount:345,publishedAt:d(-2),startDate:d(1), endDate:d(15)},
      {id:'job_11',contractorId:'con_03',siteId:'ste_03',title:'Senior Electrician – IT Campus',     skillCategory:'Construction',requiredSkillId:'skl_electrical', workerCount:8, filledCount:2,dailyWage:1200,weeklyWage:7200,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:456,publishedAt:d(-8),startDate:d(-1),endDate:d(120)},
      {id:'job_12',contractorId:'con_03',siteId:'ste_03',title:'Solar Panel Installer',              skillCategory:'Construction',requiredSkillId:'skl_electrical', workerCount:4, filledCount:0,dailyWage:1100,weeklyWage:6600,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:234,publishedAt:d(-3),startDate:d(4), endDate:d(45)},
      {id:'job_13',contractorId:'con_03',siteId:null,    title:'Computer Hardware Technician',       skillCategory:'Technology',  requiredSkillId:'skl_pc_repair',  workerCount:6, filledCount:0,dailyWage:900, weeklyWage:5400,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:312,publishedAt:d(-5),startDate:d(2), endDate:d(30)},
      {id:'job_14',contractorId:'con_03',siteId:null,    title:'Mobile Repair Technician',           skillCategory:'Technology',  requiredSkillId:'skl_mob_repair', workerCount:2, filledCount:0,dailyWage:800, weeklyWage:4800,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:189,publishedAt:d(-4),startDate:d(3), endDate:d(180)},
      {id:'job_15',contractorId:'con_03',siteId:null,    title:'Electrician Helper',                 skillCategory:'Construction',requiredSkillId:'skl_electrical', workerCount:5, filledCount:0,dailyWage:600, weeklyWage:3600,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:145,publishedAt:d(-6),startDate:d(5), endDate:d(60)},
      {id:'job_16',contractorId:'con_04',siteId:'ste_04',title:'Lead Plumber – Gated Community',     skillCategory:'Construction',requiredSkillId:'skl_plumbing',   workerCount:4, filledCount:1,dailyWage:1000,weeklyWage:6000,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:267,publishedAt:d(-9),startDate:d(-2),endDate:d(90)},
      {id:'job_17',contractorId:'con_04',siteId:'ste_04',title:'Tile Work – Bathroom Finishing',     skillCategory:'Construction',requiredSkillId:'skl_tiling',     workerCount:6, filledCount:0,dailyWage:850, weeklyWage:5100,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:198,publishedAt:d(-4),startDate:d(3), endDate:d(70)},
      {id:'job_18',contractorId:'con_04',siteId:null,    title:'Housekeeping Staff',                 skillCategory:'Domestic',    requiredSkillId:'skl_housekeeping',workerCount:8,filledCount:0,dailyWage:450, weeklyWage:2700,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:134,publishedAt:d(-3),startDate:d(2), endDate:d(365)},
      {id:'job_19',contractorId:'con_04',siteId:null,    title:'Cook – Canteen',                     skillCategory:'Domestic',    requiredSkillId:'skl_cooking',    workerCount:2, filledCount:0,dailyWage:700, weeklyWage:4200,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:156,publishedAt:d(-5),startDate:d(1), endDate:d(120)},
      {id:'job_20',contractorId:'con_04',siteId:null,    title:'Mason – Compound Wall',              skillCategory:'Construction',requiredSkillId:'skl_masonry',    workerCount:4, filledCount:0,dailyWage:750, weeklyWage:4500,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:true, viewCount:278,publishedAt:d(-1),startDate:d(2), endDate:d(25)},
      {id:'job_21',contractorId:'con_05',siteId:'ste_05',title:'HVAC Technician – Commercial Tower', skillCategory:'Construction',requiredSkillId:null,             workerCount:6, filledCount:2,dailyWage:1300,weeklyWage:7800,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:389,publishedAt:d(-12),startDate:d(-5),endDate:d(150)},
      {id:'job_22',contractorId:'con_05',siteId:'ste_05',title:'Welder – Duct Fabrication',          skillCategory:'Construction',requiredSkillId:'skl_welding',    workerCount:4, filledCount:0,dailyWage:1200,weeklyWage:7200,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:223,publishedAt:d(-6),startDate:d(4), endDate:d(60)},
      {id:'job_23',contractorId:'con_05',siteId:null,    title:'Machine Operator – CNC',             skillCategory:'Manufacturing',requiredSkillId:'skl_machine_op',workerCount:3, filledCount:0,dailyWage:1100,weeklyWage:6600,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:167,publishedAt:d(-4),startDate:d(3), endDate:d(90)},
      {id:'job_24',contractorId:'con_05',siteId:null,    title:'Plumber – Commercial',               skillCategory:'Construction',requiredSkillId:'skl_plumbing',   workerCount:3, filledCount:0,dailyWage:950, weeklyWage:5700,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:198,publishedAt:d(-3),startDate:d(2), endDate:d(75)},
      {id:'job_25',contractorId:'con_05',siteId:null,    title:'Quality Control Inspector',          skillCategory:'Manufacturing',requiredSkillId:'skl_qc',         workerCount:2, filledCount:0,dailyWage:900, weeklyWage:5400,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:145,publishedAt:d(-5),startDate:d(3), endDate:d(120)},
      {id:'job_26',contractorId:'con_01',siteId:null,title:'Daily Mason',               skillCategory:'Construction', requiredSkillId:'skl_masonry',    workerCount:2,filledCount:0,dailyWage:700, jobType:'DAILY',   status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:78, publishedAt:d(-2),startDate:d(1),endDate:d(30)},
      {id:'job_27',contractorId:'con_02',siteId:null,title:'Daily Electrician',         skillCategory:'Construction', requiredSkillId:'skl_electrical', workerCount:2,filledCount:0,dailyWage:900, jobType:'DAILY',   status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:92, publishedAt:d(-3),startDate:d(1),endDate:d(15)},
      {id:'job_28',contractorId:'con_03',siteId:null,title:'Daily Carpenter',           skillCategory:'Construction', requiredSkillId:'skl_carpentry',  workerCount:1,filledCount:0,dailyWage:800, jobType:'DAILY',   status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:65, publishedAt:d(-1),startDate:d(1),endDate:d(7)},
      {id:'job_29',contractorId:'con_04',siteId:null,title:'Daily Plumber',             skillCategory:'Construction', requiredSkillId:'skl_plumbing',   workerCount:1,filledCount:0,dailyWage:750, jobType:'DAILY',   status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:56, publishedAt:d(-2),startDate:d(1),endDate:d(30)},
      {id:'job_30',contractorId:'con_05',siteId:null,title:'Daily Welder',              skillCategory:'Construction', requiredSkillId:'skl_welding',    workerCount:2,filledCount:0,dailyWage:1100,jobType:'DAILY',   status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:87, publishedAt:d(-4),startDate:d(1),endDate:d(10)},
      {id:'job_31',contractorId:'con_01',siteId:null,title:'Domestic Cook',             skillCategory:'Domestic',     requiredSkillId:'skl_cooking',    workerCount:1,filledCount:0,dailyWage:600, weeklyWage:3600,jobType:'WEEKLY',  status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:145,publishedAt:d(-5),startDate:d(3),endDate:d(365)},
      {id:'job_32',contractorId:'con_02',siteId:null,title:'Housekeeping Staff',        skillCategory:'Domestic',     requiredSkillId:'skl_housekeeping',workerCount:2,filledCount:0,dailyWage:450, weeklyWage:2700,jobType:'WEEKLY',  status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:123,publishedAt:d(-4),startDate:d(2),endDate:d(180)},
      {id:'job_33',contractorId:'con_03',siteId:null,title:'Driver – Material Transport',skillCategory:'Transport',   requiredSkillId:'skl_driving',    workerCount:2,filledCount:0,dailyWage:750, weeklyWage:4500,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:178,publishedAt:d(-6),startDate:d(4),endDate:d(90)},
      {id:'job_34',contractorId:'con_04',siteId:null,title:'Loading/Unloading Labour',  skillCategory:'Transport',    requiredSkillId:'skl_loading',    workerCount:5,filledCount:0,dailyWage:500, weeklyWage:3000,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:89, publishedAt:d(-3),startDate:d(1),endDate:d(30)},
      {id:'job_35',contractorId:'con_05',siteId:null,title:'Driver – HMV Truck',        skillCategory:'Transport',    requiredSkillId:'skl_driving',    workerCount:3,filledCount:0,dailyWage:900, weeklyWage:5400,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:134,publishedAt:d(-5),startDate:d(2),endDate:d(45)},
      {id:'job_36',contractorId:'con_02',siteId:null,title:'Machine Operator – Fabrication',skillCategory:'Manufacturing',requiredSkillId:'skl_machine_op',workerCount:4,filledCount:0,dailyWage:1000,weeklyWage:6000,jobType:'WEEKLY',status:'PUBLISHED',city:'Delhi',state:'Delhi',isUrgent:false,viewCount:198,publishedAt:d(-7),startDate:d(5),endDate:d(60)},
      {id:'job_37',contractorId:'con_03',siteId:null,title:'QC Analyst – Manufacturing', skillCategory:'Manufacturing',requiredSkillId:'skl_qc',         workerCount:2,filledCount:0,dailyWage:950, weeklyWage:5700,jobType:'WEEKLY',  status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:156,publishedAt:d(-4),startDate:d(3),endDate:d(90)},
      {id:'job_38',contractorId:'con_01',siteId:null,title:'Gardener – Landscape',       skillCategory:'Domestic',     requiredSkillId:'skl_gardening',  workerCount:2,filledCount:0,dailyWage:550, weeklyWage:3300,jobType:'WEEKLY',  status:'PUBLISHED',city:'Pune',     state:'Maharashtra',isUrgent:false,viewCount:112,publishedAt:d(-3),startDate:d(2),endDate:d(365)},
      {id:'job_39',contractorId:'con_05',siteId:null,title:'Farm Labour',                skillCategory:'Agriculture',  requiredSkillId:'skl_farming',    workerCount:10,filledCount:0,dailyWage:400, weeklyWage:2400,jobType:'WEEKLY',  status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:87, publishedAt:d(-2),startDate:d(5),endDate:d(30)},
      {id:'job_40',contractorId:'con_04',siteId:null,title:'Harvesting Labour',          skillCategory:'Agriculture',  requiredSkillId:'skl_harvesting', workerCount:15,filledCount:0,dailyWage:380, weeklyWage:2280,jobType:'WEEKLY',  status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:76, publishedAt:d(-1),startDate:d(7),endDate:d(20)},
      {id:'job_41',contractorId:'con_01',siteId:null,title:'Civil Contractor – Sublet',  skillCategory:'Construction', requiredSkillId:null,             workerCount:15,filledCount:0,dailyWage:800, jobType:'CONTRACT',status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:false,viewCount:289,publishedAt:d(-8),startDate:d(7),endDate:d(120)},
      {id:'job_42',contractorId:'con_03',siteId:null,title:'Electrical Supervisor',      skillCategory:'Construction', requiredSkillId:'skl_electrical', workerCount:1, filledCount:0,dailyWage:2000,jobType:'CONTRACT',status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:345,publishedAt:d(-10),startDate:d(-2),endDate:d(180)},
      {id:'job_43',contractorId:'con_05',siteId:null,title:'HVAC Project Manager',       skillCategory:'Construction', requiredSkillId:null,             workerCount:1, filledCount:0,dailyWage:2500,jobType:'CONTRACT',status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:412,publishedAt:d(-12),startDate:d(-5),endDate:d(200)},
      {id:'job_44',contractorId:'con_02',siteId:null,title:'Interior Design Carpenter',  skillCategory:'Construction', requiredSkillId:'skl_carpentry',  workerCount:8, filledCount:0,dailyWage:1100,jobType:'CONTRACT',status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:false,viewCount:267,publishedAt:d(-6),startDate:d(4),endDate:d(90)},
      {id:'job_45',contractorId:'con_04',siteId:null,title:'Plumbing Subcontractor',     skillCategory:'Construction', requiredSkillId:'skl_plumbing',   workerCount:6, filledCount:0,dailyWage:900, jobType:'CONTRACT',status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:false,viewCount:198,publishedAt:d(-5),startDate:d(10),endDate:d(150)},
      {id:'job_46',contractorId:'con_01',siteId:null,title:'Emergency Electrician',      skillCategory:'Construction', requiredSkillId:'skl_electrical', workerCount:2, filledCount:0,dailyWage:1500,jobType:'DAILY',   status:'PUBLISHED',city:'Mumbai',   state:'Maharashtra',isUrgent:true, viewCount:567,publishedAt:d(-1),startDate:d(1),endDate:d(3)},
      {id:'job_47',contractorId:'con_04',siteId:null,title:'Emergency Plumber',          skillCategory:'Construction', requiredSkillId:'skl_plumbing',   workerCount:1, filledCount:0,dailyWage:1200,jobType:'DAILY',   status:'PUBLISHED',city:'Chennai',  state:'Tamil Nadu', isUrgent:true, viewCount:423,publishedAt:d(-1),startDate:d(1),endDate:d(2)},
      {id:'job_48',contractorId:'con_02',siteId:null,title:'Urgent Painter',             skillCategory:'Construction', requiredSkillId:'skl_painting',   workerCount:6, filledCount:0,dailyWage:1100,jobType:'DAILY',   status:'PUBLISHED',city:'Delhi',    state:'Delhi',      isUrgent:true, viewCount:389,publishedAt:d(-1),startDate:d(1),endDate:d(2)},
      {id:'job_49',contractorId:'con_03',siteId:null,title:'Full-time Cook',             skillCategory:'Domestic',     requiredSkillId:'skl_cooking',    workerCount:3, filledCount:0,dailyWage:18000,jobType:'MONTHLY', status:'PUBLISHED',city:'Bangalore',state:'Karnataka',  isUrgent:false,viewCount:234,publishedAt:d(-9),startDate:d(5),endDate:d(365)},
      {id:'job_50',contractorId:'con_05',siteId:null,title:'Security Guard',             skillCategory:'Construction', requiredSkillId:null,             workerCount:4, filledCount:0,dailyWage:12000,jobType:'MONTHLY', status:'PUBLISHED',city:'Hyderabad',state:'Telangana',  isUrgent:false,viewCount:178,publishedAt:d(-7),startDate:d(3),endDate:d(365)},
    ],
    skipDuplicates: true,
  });
  console.log('✅  Jobs (50)');

  await prisma.jobApplication.createMany({
    data: [
      {id:'app_001',jobId:'job_01',workerId:'wkr_01',status:'HIRED',      coverNote:'8 years masonry, expert in RCC.',              appliedAt:d(-4)},
      {id:'app_002',jobId:'job_01',workerId:'wkr_09',status:'SHORTLISTED',coverNote:'Expert plumber, also skilled in masonry.',      appliedAt:d(-3)},
      {id:'app_003',jobId:'job_01',workerId:'wkr_15',status:'SHORTLISTED',coverNote:'20 years masonry, high-rise projects.',         appliedAt:d(-3)},
      {id:'app_004',jobId:'job_01',workerId:'wkr_05',status:'SUBMITTED',  coverNote:'Experienced construction worker in Mumbai.',    appliedAt:d(-2)},
      {id:'app_005',jobId:'job_01',workerId:'wkr_11',status:'REJECTED',   coverNote:'Available for masonry from next week.',         appliedAt:d(-4)},
      {id:'app_006',jobId:'job_02',workerId:'wkr_01',status:'HIRED',      coverNote:'Expert tile installer 5 years vitrified.',      appliedAt:d(-3)},
      {id:'app_007',jobId:'job_02',workerId:'wkr_09',status:'SUBMITTED',  coverNote:'Tile work alongside plumbing.',                 appliedAt:d(-2)},
      {id:'app_008',jobId:'job_02',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'Expert in all types of tile work.',             appliedAt:d(-1)},
      {id:'app_009',jobId:'job_02',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Welder, can do tile work too.',                 appliedAt:d(-2)},
      {id:'app_010',jobId:'job_03',workerId:'wkr_05',status:'SUBMITTED',  coverNote:'Painting supervisor, 12+ painters managed.',    appliedAt:d(-1)},
      {id:'app_011',jobId:'job_03',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'15 years painting, supervised teams.',          appliedAt:d(-1)},
      {id:'app_012',jobId:'job_03',workerId:'wkr_07',status:'VIEWED',     coverNote:'Can supervise painting work.',                  appliedAt:d(-2)},
      {id:'app_013',jobId:'job_05',workerId:'wkr_09',status:'HIRED',      coverNote:'Expert plumber 9yr, high-rise GI & CPVC.',      appliedAt:d(-8)},
      {id:'app_014',jobId:'job_05',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'3 years plumbing experience.',                  appliedAt:d(-5)},
      {id:'app_015',jobId:'job_05',workerId:'wkr_06',status:'SUBMITTED',  coverNote:'Residential plumbing experience.',              appliedAt:d(-3)},
      {id:'app_016',jobId:'job_06',workerId:'wkr_05',status:'HIRED',      coverNote:'Expert carpenter 12yr office furniture.',       appliedAt:d(-2)},
      {id:'app_017',jobId:'job_06',workerId:'wkr_17',status:'HIRED',      coverNote:'13yr carpentry luxury interiors.',              appliedAt:d(-2)},
      {id:'app_018',jobId:'job_06',workerId:'wkr_07',status:'HIRED',      coverNote:'Expert welder and carpenter.',                  appliedAt:d(-1)},
      {id:'app_019',jobId:'job_06',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'Available for carpentry in Delhi.',             appliedAt:d(-3)},
      {id:'app_020',jobId:'job_06',workerId:'wkr_16',status:'SUBMITTED',  coverNote:'Seeking carpentry experience.',                 appliedAt:d(-1)},
      {id:'app_021',jobId:'job_08',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Expert electrician 10yr HT/LT buildings.',      appliedAt:d(-1)},
      {id:'app_022',jobId:'job_08',workerId:'wkr_13',status:'SUBMITTED',  coverNote:'Advanced electrician 6 years.',                appliedAt:d(-1)},
      {id:'app_023',jobId:'job_08',workerId:'wkr_07',status:'VIEWED',     coverNote:'Experienced in industrial electrical.',         appliedAt:d(-2)},
      {id:'app_024',jobId:'job_09',workerId:'wkr_01',status:'SUBMITTED',  coverNote:'Expert mason for boundary wall.',               appliedAt:d(-6)},
      {id:'app_025',jobId:'job_09',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'20yr masonry boundary walls.',                  appliedAt:d(-5)},
      {id:'app_026',jobId:'job_09',workerId:'wkr_09',status:'VIEWED',     coverNote:'Can manage masonry team of 8.',                 appliedAt:d(-4)},
      {id:'app_027',jobId:'job_10',workerId:'wkr_11',status:'SUBMITTED',  coverNote:'Available for demolition work.',                appliedAt:d(-1)},
      {id:'app_028',jobId:'job_10',workerId:'wkr_19',status:'SUBMITTED',  coverNote:'Experienced heavy manual labour.',              appliedAt:d(-1)},
      {id:'app_029',jobId:'job_10',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'Available for daily wage in Delhi.',            appliedAt:d(-2)},
      {id:'app_030',jobId:'job_11',workerId:'wkr_03',status:'HIRED',      coverNote:'Expert electrician 10yr HT/LT UPS.',            appliedAt:d(-7)},
      {id:'app_031',jobId:'job_11',workerId:'wkr_13',status:'HIRED',      coverNote:'Advanced electrician large-scale.',             appliedAt:d(-7)},
      {id:'app_032',jobId:'job_11',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Large electrical project experience.',          appliedAt:d(-5)},
      {id:'app_033',jobId:'job_11',workerId:'wkr_05',status:'VIEWED',     coverNote:'Seeking electrical work in Bangalore.',         appliedAt:d(-4)},
      {id:'app_034',jobId:'job_12',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Expert electrician solar installation.',        appliedAt:d(-2)},
      {id:'app_035',jobId:'job_12',workerId:'wkr_13',status:'SUBMITTED',  coverNote:'Advanced electrician solar panels.',            appliedAt:d(-2)},
      {id:'app_036',jobId:'job_16',workerId:'wkr_09',status:'HIRED',      coverNote:'Expert plumber 9yr community projects.',        appliedAt:d(-8)},
      {id:'app_037',jobId:'job_16',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'Ready for larger plumbing projects.',           appliedAt:d(-5)},
      {id:'app_038',jobId:'job_16',workerId:'wkr_06',status:'VIEWED',     coverNote:'Available for plumbing in Chennai.',            appliedAt:d(-3)},
      {id:'app_039',jobId:'job_17',workerId:'wkr_01',status:'SUBMITTED',  coverNote:'Expert tile installer premium work.',           appliedAt:d(-3)},
      {id:'app_040',jobId:'job_17',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'Expert tile work 12 years.',                   appliedAt:d(-2)},
      {id:'app_041',jobId:'job_18',workerId:'wkr_02',status:'SUBMITTED',  coverNote:'Advanced housekeeping 5 years.',               appliedAt:d(-2)},
      {id:'app_042',jobId:'job_18',workerId:'wkr_06',status:'SUBMITTED',  coverNote:'Advanced housekeeping 6 years.',               appliedAt:d(-2)},
      {id:'app_043',jobId:'job_18',workerId:'wkr_12',status:'SUBMITTED',  coverNote:'Expert housekeeping and cooking.',              appliedAt:d(-1)},
      {id:'app_044',jobId:'job_19',workerId:'wkr_02',status:'SUBMITTED',  coverNote:'Expert cook North/South Indian cuisine.',       appliedAt:d(-4)},
      {id:'app_045',jobId:'job_19',workerId:'wkr_12',status:'SUBMITTED',  coverNote:'Expert cook for large canteen.',               appliedAt:d(-3)},
      {id:'app_046',jobId:'job_21',workerId:'wkr_07',status:'HIRED',      coverNote:'Expert welder HVAC duct 15 years.',            appliedAt:d(-11)},
      {id:'app_047',jobId:'job_21',workerId:'wkr_17',status:'HIRED',      coverNote:'Expert carpenter HVAC duct fabrication.',      appliedAt:d(-10)},
      {id:'app_048',jobId:'job_21',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Electrician HVAC control systems.',            appliedAt:d(-8)},
      {id:'app_049',jobId:'job_22',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Expert welder 15yr TIG/MIG certified.',        appliedAt:d(-5)},
      {id:'app_050',jobId:'job_22',workerId:'wkr_17',status:'SUBMITTED',  coverNote:'Advanced welding duct fabrication.',           appliedAt:d(-4)},
      {id:'app_051',jobId:'job_23',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Advanced machine operator CNC experience.',    appliedAt:d(-3)},
      {id:'app_052',jobId:'job_23',workerId:'wkr_14',status:'SUBMITTED',  coverNote:'Intermediate machine operator available.',     appliedAt:d(-2)},
      {id:'app_053',jobId:'job_24',workerId:'wkr_09',status:'SUBMITTED',  coverNote:'Expert plumber commercial buildings.',         appliedAt:d(-2)},
      {id:'app_054',jobId:'job_24',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'Available for commercial plumbing.',           appliedAt:d(-1)},
      {id:'app_055',jobId:'job_25',workerId:'wkr_14',status:'SUBMITTED',  coverNote:'QC background HVAC quality work.',             appliedAt:d(-4)},
      {id:'app_056',jobId:'job_25',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Manufacturing QC with fabrication.',           appliedAt:d(-3)},
      {id:'app_057',jobId:'job_26',workerId:'wkr_01',status:'SUBMITTED',  coverNote:'Expert mason daily wage.',                     appliedAt:d(-1)},
      {id:'app_058',jobId:'job_26',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'Available for daily masonry.',                 appliedAt:d(-1)},
      {id:'app_059',jobId:'job_27',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Expert electrician daily maintenance.',        appliedAt:d(-2)},
      {id:'app_060',jobId:'job_27',workerId:'wkr_13',status:'SUBMITTED',  coverNote:'Available for daily electrical.',              appliedAt:d(-1)},
      {id:'app_061',jobId:'job_28',workerId:'wkr_05',status:'SUBMITTED',  coverNote:'Expert carpenter daily snag fixing.',          appliedAt:d(-1)},
      {id:'app_062',jobId:'job_28',workerId:'wkr_17',status:'SUBMITTED',  coverNote:'Available for daily carpentry.',               appliedAt:d(-1)},
      {id:'app_063',jobId:'job_29',workerId:'wkr_09',status:'SUBMITTED',  coverNote:'Expert plumber on-call leakage.',              appliedAt:d(-1)},
      {id:'app_064',jobId:'job_30',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Expert welder structural repairs.',            appliedAt:d(-3)},
      {id:'app_065',jobId:'job_31',workerId:'wkr_02',status:'SUBMITTED',  coverNote:'Expert cook worker hostel.',                   appliedAt:d(-4)},
      {id:'app_066',jobId:'job_31',workerId:'wkr_12',status:'SUBMITTED',  coverNote:'Expert cook 8yr multi-cuisine.',               appliedAt:d(-3)},
      {id:'app_067',jobId:'job_32',workerId:'wkr_06',status:'SUBMITTED',  coverNote:'Advanced housekeeping 6 years.',               appliedAt:d(-3)},
      {id:'app_068',jobId:'job_32',workerId:'wkr_10',status:'SUBMITTED',  coverNote:'Advanced housekeeping office complex.',        appliedAt:d(-2)},
      {id:'app_069',jobId:'job_33',workerId:'wkr_11',status:'SUBMITTED',  coverNote:'Expert driver 11yr LMV/HMV.',                  appliedAt:d(-5)},
      {id:'app_070',jobId:'job_33',workerId:'wkr_19',status:'SUBMITTED',  coverNote:'Advanced driver material transport.',          appliedAt:d(-4)},
      {id:'app_071',jobId:'job_34',workerId:'wkr_11',status:'SUBMITTED',  coverNote:'Experienced loading unloading.',               appliedAt:d(-2)},
      {id:'app_072',jobId:'job_34',workerId:'wkr_19',status:'SUBMITTED',  coverNote:'Available warehouse loading.',                 appliedAt:d(-1)},
      {id:'app_073',jobId:'job_35',workerId:'wkr_11',status:'SUBMITTED',  coverNote:'Expert HMV driver 11 years.',                  appliedAt:d(-4)},
      {id:'app_074',jobId:'job_35',workerId:'wkr_19',status:'SUBMITTED',  coverNote:'Advanced driver truck transport.',             appliedAt:d(-3)},
      {id:'app_075',jobId:'job_36',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'Advanced machine operator fabrication.',       appliedAt:d(-6)},
      {id:'app_076',jobId:'job_36',workerId:'wkr_14',status:'SUBMITTED',  coverNote:'Machine operation manufacturing.',             appliedAt:d(-5)},
      {id:'app_077',jobId:'job_37',workerId:'wkr_14',status:'SUBMITTED',  coverNote:'QC analyst manufacturing background.',        appliedAt:d(-3)},
      {id:'app_078',jobId:'job_38',workerId:'wkr_04',status:'SUBMITTED',  coverNote:'Gardening landscape available.',               appliedAt:d(-2)},
      {id:'app_079',jobId:'job_38',workerId:'wkr_16',status:'SUBMITTED',  coverNote:'Beginner gardener seeking experience.',        appliedAt:d(-1)},
      {id:'app_080',jobId:'job_39',workerId:'wkr_18',status:'SUBMITTED',  coverNote:'Expert farmer 16yr paddy cultivation.',        appliedAt:d(-1)},
      {id:'app_081',jobId:'job_39',workerId:'wkr_20',status:'SUBMITTED',  coverNote:'Experienced agricultural labour.',             appliedAt:d(-1)},
      {id:'app_082',jobId:'job_40',workerId:'wkr_18',status:'SUBMITTED',  coverNote:'Expert harvesting 14 years.',                  appliedAt:d(-1)},
      {id:'app_083',jobId:'job_40',workerId:'wkr_20',status:'SUBMITTED',  coverNote:'Available mango orchard harvesting.',          appliedAt:d(-1)},
      {id:'app_084',jobId:'job_41',workerId:'wkr_01',status:'SUBMITTED',  coverNote:'Expert mason civil sublet contract.',          appliedAt:d(-7)},
      {id:'app_085',jobId:'job_41',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'20yr mason apartment finishing.',              appliedAt:d(-6)},
      {id:'app_086',jobId:'job_42',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Expert electrician supervisor role.',          appliedAt:d(-9)},
      {id:'app_087',jobId:'job_42',workerId:'wkr_13',status:'SUBMITTED',  coverNote:'Advanced electrician supervisor.',             appliedAt:d(-8)},
      {id:'app_088',jobId:'job_43',workerId:'wkr_07',status:'SUBMITTED',  coverNote:'15yr experience large HVAC projects.',         appliedAt:d(-11)},
      {id:'app_089',jobId:'job_44',workerId:'wkr_05',status:'SUBMITTED',  coverNote:'Expert carpenter luxury apartments.',          appliedAt:d(-5)},
      {id:'app_090',jobId:'job_44',workerId:'wkr_17',status:'SUBMITTED',  coverNote:'Expert carpentry high-end interiors.',         appliedAt:d(-4)},
      {id:'app_091',jobId:'job_45',workerId:'wkr_09',status:'SUBMITTED',  coverNote:'Expert plumber subcontract work.',             appliedAt:d(-4)},
      {id:'app_092',jobId:'job_46',workerId:'wkr_03',status:'SUBMITTED',  coverNote:'Expert electrician available immediately.',    appliedAt:d(-1)},
      {id:'app_093',jobId:'job_46',workerId:'wkr_13',status:'SUBMITTED',  coverNote:'Emergency electrical available.',              appliedAt:d(-1)},
      {id:'app_094',jobId:'job_47',workerId:'wkr_09',status:'SUBMITTED',  coverNote:'Expert plumber emergency pipe repair.',        appliedAt:d(-1)},
      {id:'app_095',jobId:'job_48',workerId:'wkr_05',status:'SUBMITTED',  coverNote:'Expert painter, team of 6.',                   appliedAt:d(-1)},
      {id:'app_096',jobId:'job_48',workerId:'wkr_15',status:'SUBMITTED',  coverNote:'Expert painter urgent deadline.',              appliedAt:d(-1)},
      {id:'app_097',jobId:'job_49',workerId:'wkr_02',status:'SUBMITTED',  coverNote:'Expert cook IT campus food court.',            appliedAt:d(-8)},
      {id:'app_098',jobId:'job_49',workerId:'wkr_12',status:'SUBMITTED',  coverNote:'Expert cook multi-cuisine 200+ daily.',        appliedAt:d(-7)},
      {id:'app_099',jobId:'job_50',workerId:'wkr_11',status:'SUBMITTED',  coverNote:'Available for security guard position.',       appliedAt:d(-6)},
      {id:'app_100',jobId:'job_50',workerId:'wkr_19',status:'SUBMITTED',  coverNote:'Experienced security guard day shift.',        appliedAt:d(-5)},
    ],
    skipDuplicates: true,
  });
  console.log('✅  Job Applications (100)');

  await prisma.workerExperience.createMany({
    data: [
      { id:'exp_01a', workerId:'wkr_01', title:'Senior Mason',        company:'Lodha Group',           city:'Mumbai',    startDate:new Date('2020-01-01'), endDate:new Date('2023-12-31'), isCurrent:false },
      { id:'exp_01b', workerId:'wkr_01', title:'Mason',               company:'Prestige Construction', city:'Mumbai',    startDate:new Date('2016-01-01'), endDate:new Date('2019-12-31'), isCurrent:false },
      { id:'exp_03a', workerId:'wkr_03', title:'Lead Electrician',    company:'L&T Construction',      city:'Bangalore', startDate:new Date('2019-06-01'), endDate:null,                   isCurrent:true },
      { id:'exp_05a', workerId:'wkr_05', title:'Senior Carpenter',    company:'DLF Limited',           city:'Delhi',     startDate:new Date('2018-01-01'), endDate:new Date('2022-12-31'), isCurrent:false },
      { id:'exp_05b', workerId:'wkr_05', title:'Carpenter',           company:'Sobha Developers',      city:'Bangalore', startDate:new Date('2014-01-01'), endDate:new Date('2017-12-31'), isCurrent:false },
      { id:'exp_07a', workerId:'wkr_07', title:'Expert Welder',       company:'BHEL',                  city:'Jaipur',    startDate:new Date('2015-01-01'), endDate:new Date('2022-12-31'), isCurrent:false },
      { id:'exp_09a', workerId:'wkr_09', title:'Lead Plumber',        company:'Shapoorji Pallonji',    city:'Mumbai',    startDate:new Date('2019-01-01'), endDate:null,                   isCurrent:true },
      { id:'exp_11a', workerId:'wkr_11', title:'Senior Driver',       company:'DHL Logistics',         city:'Delhi',     startDate:new Date('2017-01-01'), endDate:null,                   isCurrent:true },
      { id:'exp_12a', workerId:'wkr_12', title:'Head Cook',           company:'Taj Hotels',            city:'Chennai',   startDate:new Date('2018-06-01'), endDate:new Date('2023-05-31'), isCurrent:false },
      { id:'exp_15a', workerId:'wkr_15', title:'Expert Mason',        company:'NCC Limited',           city:'Pune',      startDate:new Date('2010-01-01'), endDate:new Date('2020-12-31'), isCurrent:false },
      { id:'exp_15b', workerId:'wkr_15', title:'Painting Supervisor', company:'Puravankara',           city:'Pune',      startDate:new Date('2021-01-01'), endDate:null,                   isCurrent:true },
      { id:'exp_17a', workerId:'wkr_17', title:'Master Carpenter',    company:'Kolkata Timber Works',  city:'Kolkata',   startDate:new Date('2016-01-01'), endDate:null,                   isCurrent:true },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Worker Experiences');

  await prisma.workerRating.createMany({
    data: [
      { id:'rat_01', workerId:'wkr_01', contractorId:'con_01', jobId:'job_01', rating:4.5, review:'Excellent masonry work, highly professional.' },
      { id:'rat_02', workerId:'wkr_09', contractorId:'con_01', jobId:'job_05', rating:4.8, review:'Top quality plumbing, completed on time.' },
      { id:'rat_03', workerId:'wkr_05', contractorId:'con_02', jobId:'job_06', rating:4.7, review:'Expert carpenter, meticulous finish.' },
      { id:'rat_04', workerId:'wkr_17', contractorId:'con_02', jobId:'job_06', rating:4.6, review:'Great carpentry skills and work ethics.' },
      { id:'rat_05', workerId:'wkr_07', contractorId:'con_02', jobId:'job_06', rating:4.9, review:'Brilliant multi-skilled worker.' },
      { id:'rat_06', workerId:'wkr_03', contractorId:'con_03', jobId:'job_11', rating:5.0, review:'Best electrician we have worked with.' },
      { id:'rat_07', workerId:'wkr_13', contractorId:'con_03', jobId:'job_11', rating:4.4, review:'Good electrician, reliable.' },
      { id:'rat_08', workerId:'wkr_09', contractorId:'con_04', jobId:'job_16', rating:4.8, review:'Expert plumber for large community project.' },
      { id:'rat_09', workerId:'wkr_07', contractorId:'con_05', jobId:'job_21', rating:4.7, review:'Outstanding HVAC duct welding.' },
      { id:'rat_10', workerId:'wkr_17', contractorId:'con_05', jobId:'job_21', rating:4.6, review:'Expert duct fabrication carpenter.' },
    ],
    skipDuplicates: true,
  });
  console.log('✅  Worker Ratings');

  console.log('\n🎉  Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊  Records: 10 Locations | 18 Skills | 2 Admins | 3 Companies | 5 Contractors | 20 Workers | 5 Sites | 50 Jobs | 100 Applications');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('❌  Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
