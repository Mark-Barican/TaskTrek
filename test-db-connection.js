// Quick test script to verify Neon database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing Neon database connection...\n');

    // Test 1: Count users
    const userCount = await prisma.user.count();
    console.log(`✅ Connected to Neon!`);
    console.log(`📊 Users in database: ${userCount}`);

    // Test 2: Count tasks
    const taskCount = await prisma.task.count();
    console.log(`📋 Tasks in database: ${taskCount}\n`);

    // Test 3: Show recent users (without passwords)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (recentUsers.length > 0) {
      console.log('👥 Recent users:');
      recentUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - Created: ${user.createdAt.toLocaleDateString()}`);
      });
    } else {
      console.log('👥 No users yet. Register a user to test!');
    }

    console.log('\n✅ Database connection test successful!');
    console.log('🎉 Your Neon database is working perfectly!\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Your .env.local file exists');
    console.error('   2. DATABASE_URL is set correctly');
    console.error('   3. Your Neon database is active\n');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

