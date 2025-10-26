import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all tasks for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT * FROM "Task" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [parseInt(userId)]
    );

    return NextResponse.json({ tasks: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// CREATE a new task
export async function POST(request: Request) {
  try {
    const { title, description, dueDate, status, assignee, userId } = await request.json();

    if (!title || !dueDate || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO "Task" (title, description, "dueDate", status, assignee, "userId") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description || '', new Date(dueDate), status || 'not-started', assignee || null, parseInt(userId)]
    );

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// UPDATE a task
export async function PUT(request: Request) {
  try {
    const { id, title, description, dueDate, status, assignee, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Task ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify the task belongs to the user
    const verifyResult = await pool.query(
      'SELECT id FROM "Task" WHERE id = $1 AND "userId" = $2',
      [parseInt(id), parseInt(userId)]
    );

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (dueDate) {
      updates.push(`"dueDate" = $${paramCount++}`);
      values.push(new Date(dueDate));
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (assignee !== undefined) {
      updates.push(`assignee = $${paramCount++}`);
      values.push(assignee);
    }

    values.push(parseInt(id));

    const result = await pool.query(
      `UPDATE "Task" SET ${updates.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${paramCount}`,
      values
    );

    // Fetch updated task
    const updatedResult = await pool.query(
      'SELECT * FROM "Task" WHERE id = $1',
      [parseInt(id)]
    );

    return NextResponse.json({ task: updatedResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Task ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify the task belongs to the user
    const verifyResult = await pool.query(
      'SELECT id FROM "Task" WHERE id = $1 AND "userId" = $2',
      [parseInt(id), parseInt(userId)]
    );

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    await pool.query(
      'DELETE FROM "Task" WHERE id = $1',
      [parseInt(id)]
    );

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
