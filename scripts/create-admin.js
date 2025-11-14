/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js <email> <password> <fullName>
 * Example: node scripts/create-admin.js admin@applypal.com SecurePass123! "Super Admin"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node scripts/create-admin.js <email> <password> <fullName>');
    console.error('Example: node scripts/create-admin.js admin@applypal.com SecurePass123! "Super Admin"');
    process.exit(1);
  }

  const [email, password, fullName] = args;

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.error(`❌ User with email ${email} already exists!`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        fullName,
        email,
        university: 'ApplyPal System',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.fullName);
    console.log('🆔 ID:', admin.id);
    console.log('🔑 Role:', admin.role);
    console.log('\n💡 You can now login with this admin account using role: "admin"');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

