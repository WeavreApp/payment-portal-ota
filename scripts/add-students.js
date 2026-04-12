require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Student data from the provided list
const students = [
  // J.S.1A
  { full_name: 'Agboba Imisioluwa', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Ahmad Imran', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Aina Ibrahim', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Aina Maryam', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Alimi Khalid', class: 'JSS1A', student_type: 'day' },
  { full_name: 'ALLi Jeremiah', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Akinremi Gold', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Amidu Yunus', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Aremu muhammed', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Atatalutfullah', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Ayoade Maryam', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Balogun Adesewa', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Bolaji awwal', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Ederi Samuel', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Efundowo Livingscript', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Folorunsho Abdulhaleem', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Hamzat Ibraheem', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Idris Mutmainah', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Ishola Jameelah', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Ogunjobi Aamilah', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Ojelade Muhammad', class: 'JSS1A', student_type: 'boarding' },
  { full_name: 'Okechukwu Ebere', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Oladimeji Taqiyah', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Omogbai Emmanuella', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Omotayo Simiat', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Oyi Favour', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Quadri Ridwanulahi', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Soliu Ibraheem', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Taiwo Abdulaleem', class: 'JSS1A', student_type: 'day' },
  { full_name: 'Taiwo Fareedah', class: 'JSS1A', student_type: 'day' },

  // J.S.1B
  { full_name: 'Adeniyi Joel', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Alabi Openipo', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Amolegbe Salam', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Amuziem Chiclubem', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Asombe Faruq', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Bakare Hamidat', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Bakinson Rihanat', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Banjoko Ifejesu', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Bamisile Dicleola', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Emeka Kamsi', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Femi John', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Ilori Esther', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Jayeoba Jeffery', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Kasali Kofoworola', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Muhammed Mordiyah', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Ogbezode Mataniah', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Ogundairo Fareedlah', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Okhue Ibhade', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Okunowo Christianah', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Olushola AL-ameen', class: 'JSS1B', student_type: 'boarding' },
  { full_name: 'Rasheed Ameerah', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Rufai Azeem', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Shasanmi Gideon', class: 'JSS1B', student_type: 'day' },
  { full_name: 'Shogbola Damilola', class: 'JSS1B', student_type: 'day' },

  // J.S.1C
  { full_name: 'Adeniran Oluwafikayomi', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Aderibigbe Darasimi', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Adisa Aishat', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Ajibola Al-ameen', class: 'JSS1C', student_type: 'boarding' },
  { full_name: 'Arigbede Sharon', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Atitebi', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Badmus Faheem', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Edoro Davina', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Hamzat Rihannat', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Kelani Lateef', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Kolawole Daniel', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Majoyeogbe Awwal', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Misbaudeen Maryam', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Mushafau Basheer', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Ogundare Moyinoluwa', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Okunsaga Olamilekan', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Olarenwajn Nasif', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Olanrewaju Oreoluwa', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Oretuga Modupe', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Rufai Anjorin', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Salami Rahma', class: 'JSS1C', student_type: 'day' },
  { full_name: 'Sheriffden Azimah', class: 'JSS1C', student_type: 'day' },

  // J.S.1D
  { full_name: 'Abdulsalam Al-ameen', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Adewusi Muiz', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Ajayi Femi', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Amusan Olamide', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Ayorinde Abdulmalik', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Hassan Ilyad', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Jimoh Jamal', class: 'JSS1D', student_type: 'boarding' },
  { full_name: 'Lawal Daniel', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Lawal Samuel', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Oluwatayo May', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Oseni Ibrahim', class: 'JSS1D', student_type: 'boarding' },
  { full_name: 'Peter Chisom', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Rita Chisom', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Sulaiman Abdullah', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Tijani Zeenah', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Moshood Ibrahim', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Oladele Elnas', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Oyebade Oluwademilade', class: 'JSS1D', student_type: 'boarding' },
  { full_name: 'Tijani Aamir', class: 'JSS1D', student_type: 'day' },
  { full_name: 'Ezenwanne Chibife', class: 'JSS1D', student_type: 'boarding' },

  // J.S.2A
  { full_name: 'Abdurrauf Abdussalam', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Adebiyi Zainab', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Adewole Tahirah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Adewole Tiwatope', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Adeyemo Anuoluwatofunmi', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Ajbode Nasirudeen', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Akintola Hassan', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Aremu Azeemah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Aremu Azeezah D.', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Asimi Mubarak', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Atiba Treasure', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Atoyebi Ramlah', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Awojide Oluwasomi', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Ayanfunso Oluwajuwonlo', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Azeez Abdulmalik', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Babawale Ifeoluwa', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Bamidele Oluwagbernisob', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Haruna Fawaz', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Jones-Abayomi Fikayomi', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Kareem Aasiyah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'King Khadeejah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Lateef Abdul Malik', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Lawal Emmanuella', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Odunsanya AbdulAzeem', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Bankole Faizah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Olagunju Surprise', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Owoseni Ololade', class: 'JSS2A', student_type: 'day' },
  { full_name: 'oyebowale Jitilope', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Oyedeji Mariam', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Oyelaja Ahmad', class: 'JSS2A', student_type: 'boarding' },
  { full_name: 'Roland Samantha', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Salawu Habeed', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Sanni Faizah', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Shobo David', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Shobogun Olasubomi', class: 'JSS2A', student_type: 'day' },
  { full_name: 'Yusuf Roqeebah', class: 'JSS2A', student_type: 'day' },

  // J.S.2B
  { full_name: 'ABASS AYOMIDE', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ABDUL AZEEZ', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ABIOLA ASHROF', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ADNIJI ABDULMALIK', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ADENUGBA HABEEBAH', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ADEYEMI PELLUMMI', class: 'JSS2B', student_type: 'boarding' },
  { full_name: 'ATIBADE FARUQ', class: 'JSS2B', student_type: 'day' },
  { full_name: 'AKINSEHINDE MARTINS', class: 'JSS2B', student_type: 'day' },
  { full_name: 'ANEBI AKOREDE', class: 'JSS2B', student_type: 'day' },
  { full_name: 'BANKOLE GIDEON', class: 'JSS2B', student_type: 'day' },
  { full_name: 'BANKOLE SULTAN.', class: 'JSS2B', student_type: 'day' },
  { full_name: 'CHUKWUMA FERNANDO', class: 'JSS2B', student_type: 'day' },
  { full_name: 'FAGBENRO FAREEDAH', class: 'JSS2B', student_type: 'boarding' },
  { full_name: 'FASHINA SUBOMI.', class: 'JSS2B', student_type: 'day' },
  { full_name: 'GBADAMOSI WURADLA', class: 'JSS2B', student_type: 'day' },
  { full_name: 'IFEBANJO IBUKUN', class: 'JSS2B', student_type: 'day' },
  { full_name: 'SIAKA KHADEEJAH', class: 'JSS2B', student_type: 'day' },
  { full_name: 'KALUKUDLA MOFEOLUMA', class: 'JSS2B', student_type: 'day' },
  { full_name: 'KOLAWOLE ABDULSAMAD', class: 'JSS2B', student_type: 'day' },
  { full_name: 'MICHEAL CHUKWUFIM', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OGUNDAIRO RODIAH', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OGUINFOWDRA ASMAH', class: 'JSS2B', student_type: 'boarding' },
  { full_name: 'OKUNADE MORDIYAH', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OLABISI Muiz', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OLATUNDUM HERITAGE', class: 'JSS2B', student_type: 'boarding' },
  { full_name: 'ONUIGBO PASCAL', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OSHINGBADE IYINOLUWA', class: 'JSS2B', student_type: 'day' },
  { full_name: 'OYEWOLE OLUWASHIKEMI', class: 'JSS2B', student_type: 'day' },
  { full_name: 'RASHEED ABDULWARIS', class: 'JSS2B', student_type: 'day' },
  { full_name: 'SHEKONI MICHEAL', class: 'JSS2B', student_type: 'day' },
  { full_name: 'SHITTA AWWAL', class: 'JSS2B', student_type: 'day' },
  { full_name: 'SHOBOGUN FAIZAH', class: 'JSS2B', student_type: 'day' },
  { full_name: 'TIJANI TAHIRAH', class: 'JSS2B', student_type: 'boarding' },
  { full_name: 'UBIJI AMARACHI', class: 'JSS2B', student_type: 'day' },
  { full_name: 'UGWUEZE MARY', class: 'JSS2B', student_type: 'day' },
  { full_name: 'WILLIAMS AL-AMEEN', class: 'JSS2B', student_type: 'day' },

  // J.S.2C
  { full_name: 'Abalagada Iremide', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Adebayo Derick', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Adewale Samuel', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Ajala Sultan', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Ajibola Precious', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Akanbi mubarak', class: 'JSS2C', student_type: 'day' },
  { full_name: 'AkanbiZeenot', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Areabesola hameedat', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Aremu faridat', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Ayanda isaac', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Banmeke Jeremiah', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Ibikunle Ibrahim', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Isiaka Hamdalat', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Jooda Abdullateef', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Mohammed Habeebat', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Mustapha Fatimah', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Ogunsaye Abdullai', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Ojo Muhamidat', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Olukayode Kiibati', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Oluwalana Ifeoluwa', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Omologo Damilola', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Salaudeen Khadijah', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Salawu Praise', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Salisu Precious', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Seriki Abdulsalam', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Shorinmade Daniel', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Yussuf Khalid', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Abiola Khalil', class: 'JSS2C', student_type: 'boarding' },
  { full_name: 'Oni Nathaniel', class: 'JSS2C', student_type: 'day' },
  { full_name: 'Yekinni Ahmad.', class: 'JSS2C', student_type: 'day' },

  // J.S.2D
  { full_name: 'Adedeji Emmanuel', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Adegboye Joshua', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Adekanbi Muhammad', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Adekunle Inioluwa', class: 'JSS2D', student_type: 'boarding' },
  { full_name: 'Adeogun Juwon', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Adesokan Josiah', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Ajayi Afolabi', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Akanni Aishat', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Akinjobi Abdul-Raheem', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Aremu Abdul-Lateef', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Awojide Oluwasoromi', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Bankole Ivana', class: 'JSS2D', student_type: 'boarding' },
  { full_name: 'Ibrahim Alveenah', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Idris Rodiat', class: 'JSS2D', student_type: 'boarding' },
  { full_name: 'Iwere Angelica', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Kudeti Baseet', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Kuranga Princess', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Nurudeen Wasilat', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Ogunjobi Morire', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Oquntade Kehinde', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Ojelade Akinkunmi', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Ojo Emmanuel', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Oladele Ruth', class: 'JSS2D', student_type: 'boarding' },
  { full_name: 'Omoyunabo Ayomide', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Sajimi Joshua', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Salauden Fridaous', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Temidays Mercy', class: 'JSS2D', student_type: 'day' },
  { full_name: 'Ezeithe Destiny', class: 'JSS2D', student_type: 'boarding' },
  { full_name: 'Yusuf Florence', class: 'JSS2D', student_type: 'boarding' },

  // J.S.3A
  { full_name: 'Abimbola Oluwadarasimi', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Abiodun Mishael', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Abu Al-Islam', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Adeniji Fatimah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Adeyemo Faruq', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Aina Morzuqah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Ajibade Aishat', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Ajijola Faaiz', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Akindele Feyikemi', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Akinjobi fareedah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Akintunde Hibatullah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Akinyokun adebola', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Ayanda Deborah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Azeez Abdulbasit', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Baiyewu Oyinkansola', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Egunfemi Dorcas', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Esin Ahamd', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Fagbuyiro Zion', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Fatai Abdulsamal', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Jinadu Precious', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Lafeef Smith', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Lawal Kazeem', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Lawal keefayah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Misbaudeen Summayyah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Ogunfunwa Eniola', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Ojelade gbemisola', class: 'JSS3A', student_type: 'boarding' },
  { full_name: 'Oladapo Abdulkhatiq', class: 'JSS3A', student_type: 'boarding' },
  { full_name: 'Olaniyi David', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Oluwatayo Matilda', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Omogo Chidinma', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Onwubiko Frances', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Oyinlola Rahmatallah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Sulaimon abdulrahmon', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Yedenu Deborah', class: 'JSS3A', student_type: 'day' },
  { full_name: 'Yusuf Fawaz', class: 'JSS3A', student_type: 'day' },

  // J.S.3B
  { full_name: 'Abdulsalam Samiat', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Abiola Boluwatife', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Adebanjo Fawaz', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Adekunle Hepzibah', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Ademola Gold', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Adeogun AbdulAzeez', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Adewunmi mark', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Adeyemo Azeedat', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Adeyemo jadesola', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Alabi Nachelle', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Amusa Abdulsamad', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Awogu Chikwunonso', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Ayanlowo ayantola', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Busari Moyinoluwa', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Eguevon Chineye', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Ezechi chiamanda', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Fadera muthmaheen', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Gbadegesin Abdulsalam', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Hassan Seyifunmi', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Kelani Ibrahim', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Moshood Fereedah', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Ogunjobi Al-meen', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Ojerinde Aqeelah', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Olayemi Abdul-mujeeb', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Oloyede Praise', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Olusokan Zinat', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Oseni Kwathar', class: 'JSS3B', student_type: 'boarding' },
  { full_name: 'Owonikoko Nimatallah', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Oyalowo Ramahtu', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Raheem Abdulsamad', class: 'JSS3B', student_type: 'day' },
  { full_name: 'Tewogbola Mariam', class: 'JSS3B', student_type: 'boarding' },

  // J.S.3C
  { full_name: 'Adebisi Folarera', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Adeniji Fathia', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Adeniran Donald', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Adeoye Oluwagbemisola', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Aina Olashile', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Anyiador Rachael', class: 'JSS3C', student_type: 'day' },
  { full_name: 'AribisalaAyomikun', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Awhagon Esther', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Ayoade Zainab', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Babayanju Yusuf', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Bankole Adewonuola', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Beke Omotoyosi', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Famodimu Immanuel', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Fayoda Ezekiel', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Kelani fareedah', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Kolawole Oyinkansola', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Lameed Zainab', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Lamina Olaoluwa', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Lasisi Aisha', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Lawal Halimah', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Muhammed Aminah', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Obianwu Nkiruka', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Ogundiro Mubarak', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Okedeyi Grace', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Olajuwon Ganiu', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Oyebade Fikayomi', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Peters Nkechiamaka', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Peters Uzochi', class: 'JSS3C', student_type: 'boarding' },
  { full_name: 'Sanni Adams', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Taiwo Fareed', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Tanimola jemilat', class: 'JSS3C', student_type: 'day' },
  { full_name: 'Ubiji- Prince Michael', class: 'JSS3C', student_type: 'day' },

  // J.S.3D
  { full_name: 'Adedeji Emmanuel', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Adeniji Fathia', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Adeniyi Akbar', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Adewunmi Mark', class: 'JSS3D', student_type: 'boarding' },
  { full_name: 'Ajanaku Akorede', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Ajao Hameema', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Akniboyede Bolutife', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Aribisala Ayomide', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Awe Morenikeji', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Bello Mariam', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Fadare Muthmaeen', class: 'JSS3D', student_type: 'boarding' },
  { full_name: 'Kelani Fareedah', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Kolawole Oyinkansola', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Lasisi Aishat', class: 'JSS3D', student_type: 'boarding' },
  { full_name: 'Lawal Haleemah', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Mohadded Animat', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Obianwu Nkiruka', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Okedenyi Grace', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Oladeinde Fareedah', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Olajuwon Genius', class: 'JSS3D', student_type: 'day' },
  { full_name: 'Peters Nkechiamaka', class: 'JSS3D', student_type: 'boarding' },
  { full_name: 'Peters Uzchi', class: 'JSS3D', student_type: 'boarding' },
  { full_name: 'Sowunmi Emmanel', class: 'JSS3D', student_type: 'day' }
];

// Function to get fee rates for a class
async function getFeeRates(className) {
  const { data, error } = await supabase
    .from('class_fee_rates')
    .select('*')
    .eq('class_name', className)
    .single();

  if (error) {
    console.error(`Error fetching fee rates for ${className}:`, error);
    return null;
  }

  return data;
}

// Function to get global hostel fee
async function getGlobalHostelFee() {
  const { data, error } = await supabase
    .from('fee_settings')
    .select('setting_value')
    .eq('setting_key', 'global_hostel_fee')
    .single();

  if (error) {
    console.error('Error fetching global hostel fee:', error);
    return 250000; // Default fallback
  }

  return data.setting_value;
}

// Function to calculate fees
function calculateFees(feeRates, hostelFee, studentType) {
  if (!feeRates) return { total_fees: 0, hostel_fee: 0 };

  const baseTuition = feeRates.day_student_fee || 0;
  const hostelFeeAmount = studentType === 'boarding' && feeRates.allows_boarding ? hostelFee : 0;
  const totalFees = baseTuition + hostelFeeAmount;

  return {
    total_fees: totalFees,
    hostel_fee: hostelFeeAmount
  };
}

// Main function to add students
async function addStudents() {
  console.log('Starting to add students to the database...');
  
  try {
    // Get global hostel fee
    const globalHostelFee = await getGlobalHostelFee();
    console.log(`Global hostel fee: ${globalHostelFee}`);

    let successCount = 0;
    let errorCount = 0;

    // Process students in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);
      
      for (const student of batch) {
        try {
          // Get fee rates for this student's class
          const feeRates = await getFeeRates(student.class);
          
          // Calculate fees
          const fees = calculateFees(feeRates, globalHostelFee, student.student_type);
          
          // Insert student with calculated fees
          const { data, error } = await supabase
            .from('students')
            .insert({
              full_name: student.full_name,
              class: student.class,
              student_type: student.student_type,
              total_fees: fees.total_fees,
              hostel_fee: fees.hostel_fee,
              payment_status: 'outstanding',
              balance_paid: 0
            })
            .select();

          if (error) {
            console.error(`Error adding student ${student.full_name}:`, error);
            errorCount++;
          } else {
            console.log(`Successfully added: ${student.full_name} (${student.class}) - Fees: ${fees.total_fees}`);
            successCount++;
          }
        } catch (err) {
          console.error(`Error processing student ${student.full_name}:`, err);
          errorCount++;
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total students processed: ${students.length}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\nStudents have been added successfully!');
      console.log('You can now view them in the admin dashboard.');
    }

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
addStudents();
