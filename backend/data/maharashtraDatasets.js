const donorDataset = [
  { name: 'Aarav Deshmukh', email: 'aarav.nagpur@lifelink.local', bloodGroup: 'A+', phone: '9000001001', age: 29, gender: 'male', city: 'Nagpur', state: 'Maharashtra' },
  { name: 'Isha Kulkarni', email: 'isha.nagpur@lifelink.local', bloodGroup: 'O-', phone: '9000001002', age: 31, gender: 'female', city: 'Nagpur', state: 'Maharashtra' },
  { name: 'Rohan Patil', email: 'rohan.pune@lifelink.local', bloodGroup: 'B+', phone: '9000001003', age: 27, gender: 'male', city: 'Pune', state: 'Maharashtra' },
  { name: 'Sneha Joshi', email: 'sneha.pune@lifelink.local', bloodGroup: 'AB+', phone: '9000001004', age: 34, gender: 'female', city: 'Pune', state: 'Maharashtra' },
  { name: 'Aditya Khanvilkar', email: 'aditya.mumbai@lifelink.local', bloodGroup: 'O+', phone: '9000001005', age: 30, gender: 'male', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Meera Shah', email: 'meera.mumbai@lifelink.local', bloodGroup: 'A-', phone: '9000001006', age: 26, gender: 'female', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pratik Chavan', email: 'pratik.nashik@lifelink.local', bloodGroup: 'B-', phone: '9000001007', age: 33, gender: 'male', city: 'Nashik', state: 'Maharashtra' },
  { name: 'Anaya Borse', email: 'anaya.nashik@lifelink.local', bloodGroup: 'AB-', phone: '9000001008', age: 28, gender: 'female', city: 'Nashik', state: 'Maharashtra' },
  { name: 'Yash Suryawanshi', email: 'yash.aurangabad@lifelink.local', bloodGroup: 'O+', phone: '9000001009', age: 25, gender: 'male', city: 'Aurangabad', state: 'Maharashtra' },
  { name: 'Pooja Jagtap', email: 'pooja.aurangabad@lifelink.local', bloodGroup: 'A+', phone: '9000001010', age: 32, gender: 'female', city: 'Aurangabad', state: 'Maharashtra' },
];

const hospitalDataset = [
  { name: 'Nagpur City Care Hospital', city: 'Nagpur', hasBloodBank: true, phone: '7100001001', address: 'Civil Lines, Nagpur' },
  { name: 'Pune Central Medical', city: 'Pune', hasBloodBank: true, phone: '7100001002', address: 'Shivaji Nagar, Pune' },
  { name: 'Mumbai Metro Hospital', city: 'Mumbai', hasBloodBank: true, phone: '7100001003', address: 'Dadar, Mumbai' },
  { name: 'Nashik Lifecare Hospital', city: 'Nashik', hasBloodBank: true, phone: '7100001004', address: 'College Road, Nashik' },
  { name: 'Aurangabad General Hospital', city: 'Aurangabad', hasBloodBank: true, phone: '7100001005', address: 'CIDCO, Aurangabad' },
];

const societyDataset = [
  { name: 'Nagpur Blood Warriors', city: 'Nagpur', contactPerson: 'Rahul Wankhede', phone: '7200001001' },
  { name: 'Pune Red Drop Society', city: 'Pune', contactPerson: 'Sakshi More', phone: '7200001002' },
  { name: 'Mumbai Donor Network', city: 'Mumbai', contactPerson: 'Zeeshan Shaikh', phone: '7200001003' },
  { name: 'Nashik Humanity Blood Group', city: 'Nashik', contactPerson: 'Kiran Gite', phone: '7200001004' },
  { name: 'Aurangabad Helping Hands', city: 'Aurangabad', contactPerson: 'Harshada Pawar', phone: '7200001005' },
];

module.exports = {
  donorDataset,
  hospitalDataset,
  societyDataset,
};