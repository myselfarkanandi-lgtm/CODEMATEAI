import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'codemate_db.json');

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  course: string;
  semester: number;
  college: string;
  programming_level: string;
  preferred_language: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface DBProfile {
  id: string;
  user_id: string;
  bio: string;
  learning_goal: string;
  current_streak: number;
  longest_streak: number;
  xp: number;
  level: number;
}

export interface DBSyllabusTopic {
  id: string;
  unit_id: string;
  title: string;
  topic_order: number;
  is_completed: boolean;
}

export interface DBSyllabusUnit {
  id: string;
  syllabus_id: string;
  title: string;
  unit_number: number;
  description: string;
  topics: DBSyllabusTopic[];
}

export interface DBSyllabus {
  id: string;
  user_id: string;
  course: string;
  semester: number;
  subject: string;
  language: string;
  units: DBSyllabusUnit[];
  created_at: string;
}

export interface DBAssignment {
  id: string;
  user_id: string;
  question: string;
  language: string;
  subject: string;
  topic: string;
  purpose: string;
  difficulty: string;
  answer_format: string;
  algorithm: string;
  code: string;
  explanation: string;
  sample_input: string;
  sample_output: string;
  result: string;
  viva_questions: string[];
  common_mistakes: string[];
  important_concepts: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface DBDoubt {
  id: string;
  user_id: string;
  question: string;
  language: string;
  answer: string;
  simple_explanation: string;
  example: string;
  related_concepts: string[];
  created_at: string;
}

export interface DBDebugSession {
  id: string;
  user_id: string;
  language: string;
  code: string;
  error_message: string;
  has_error: boolean;
  error_type: string;
  problematic_lines: number[];
  explanation: string;
  corrected_code: string;
  prevention_tip: string;
  created_at: string;
}

export interface DBPracticeSession {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  language: string;
  difficulty: string;
  total_questions: number;
  completed_questions: number;
  score: number;
  accuracy: number;
  questions: any[];
  created_at: string;
}

export interface DBQuiz {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  score: number;
  accuracy: number;
  time_taken_seconds: number;
  questions: any[];
  recommendation?: string;
  created_at: string;
}

export interface DBVivaSession {
  id: string;
  user_id: string;
  subject: string;
  language: string;
  topic: string;
  difficulty: string;
  score: number;
  turns: any[];
  status: 'in_progress' | 'completed';
  strong_topics: string[];
  weak_topics: string[];
  preparation_advice: string;
  created_at: string;
}

export interface DBProgress {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  accuracy: number;
  attempts: number;
  correct_answers: number;
  incorrect_answers: number;
  last_practiced: string;
  updated_at: string;
}

export interface DBFavorite {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  title: string;
  language: string;
  details: string;
  created_at: string;
}

export interface DBDownload {
  id: string;
  user_id: string;
  download_type: string;
  resource_id: string;
  title: string;
  format: string;
  created_at: string;
}

export interface DBConversation {
  id: string;
  user_id: string;
  title: string;
  context_type: string;
  context_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DBMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface DBNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface DBSchema {
  users: DBUser[];
  profiles: DBProfile[];
  syllabi: DBSyllabus[];
  assignments: DBAssignment[];
  doubts: DBDoubt[];
  debug_sessions: DBDebugSession[];
  practice_sessions: DBPracticeSession[];
  quizzes: DBQuiz[];
  viva_sessions: DBVivaSession[];
  progress: DBProgress[];
  favorites: DBFavorite[];
  downloads: DBDownload[];
  conversations: DBConversation[];
  messages: DBMessage[];
  notifications: DBNotification[];
}

class DatabaseManager {
  private db: DBSchema;

  constructor() {
    this.db = this.initData();
  }

  private initData(): DBSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Could not read existing database file, seeding new database:', err);
    }

    const seeded = this.seedInitialData();
    this.saveToDisk(seeded);
    return seeded;
  }

  private saveToDisk(data?: DBSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  public getRawData(): DBSchema {
    return this.db;
  }

  public persist() {
    this.saveToDisk();
  }

  private seedInitialData(): DBSchema {
    const demoUserId = 'usr_arka_nandi_01';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);

    const now = new Date().toISOString();

    const demoUser: DBUser = {
      id: demoUserId,
      name: 'Arka Nandi',
      email: 'myselfarkanandi@gmail.com',
      password_hash: passwordHash,
      course: 'B.Pharm',
      semester: 1,
      college: 'Institute of Technology & Sciences',
      programming_level: 'Beginner',
      preferred_language: 'c',
      role: 'student',
      created_at: now,
      updated_at: now,
    };

    const demoProfile: DBProfile = {
      id: 'prof_arka_01',
      user_id: demoUserId,
      bio: 'Pharmacy student learning C programming for computational analytics and lab assignments.',
      learning_goal: 'Master algorithmic problem solving, secure top grade in C Lab Exam & Viva.',
      current_streak: 5,
      longest_streak: 12,
      xp: 1420,
      level: 4,
    };

    const demoSyllabus: DBSyllabus = {
      id: 'syl_c_01',
      user_id: demoUserId,
      course: 'B.Pharm',
      semester: 1,
      subject: 'Computer Applications in Pharmacy (C Programming)',
      language: 'c',
      created_at: now,
      units: [
        {
          id: 'unit_1',
          syllabus_id: 'syl_c_01',
          title: 'Unit 1 — Introduction to C',
          unit_number: 1,
          description: 'Basic C structure, tokens, data types, standard I/O (printf, scanf).',
          topics: [
            { id: 'top_1_1', unit_id: 'unit_1', title: 'Structure of C Program', topic_order: 1, is_completed: true },
            { id: 'top_1_2', unit_id: 'unit_1', title: 'Data Types & Variables', topic_order: 2, is_completed: true },
            { id: 'top_1_3', unit_id: 'unit_1', title: 'Input/Output Functions (printf, scanf)', topic_order: 3, is_completed: true },
          ],
        },
        {
          id: 'unit_2',
          syllabus_id: 'syl_c_01',
          title: 'Unit 2 — Operators',
          unit_number: 2,
          description: 'Arithmetic, relational, logical, bitwise, assignment, and conditional operators.',
          topics: [
            { id: 'top_2_1', unit_id: 'unit_2', title: 'Arithmetic & Relational Operators', topic_order: 1, is_completed: true },
            { id: 'top_2_2', unit_id: 'unit_2', title: 'Logical & Bitwise Operators', topic_order: 2, is_completed: true },
            { id: 'top_2_3', unit_id: 'unit_2', title: 'Operator Precedence & Associativity', topic_order: 3, is_completed: true },
          ],
        },
        {
          id: 'unit_3',
          syllabus_id: 'syl_c_01',
          title: 'Unit 3 — Conditional Statements',
          unit_number: 3,
          description: 'if, if-else, nested if, switch-case, ternary operator.',
          topics: [
            { id: 'top_3_1', unit_id: 'unit_3', title: 'if-else & Nested if', topic_order: 1, is_completed: true },
            { id: 'top_3_2', unit_id: 'unit_3', title: 'else-if Ladder', topic_order: 2, is_completed: true },
            { id: 'top_3_3', unit_id: 'unit_3', title: 'switch-case & break', topic_order: 3, is_completed: true },
          ],
        },
        {
          id: 'unit_4',
          syllabus_id: 'syl_c_01',
          title: 'Unit 4 — Loops',
          unit_number: 4,
          description: 'for loop, while loop, do-while loop, nested loops, break, continue.',
          topics: [
            { id: 'top_4_1', unit_id: 'unit_4', title: 'while & do-while Loops', topic_order: 1, is_completed: true },
            { id: 'top_4_2', unit_id: 'unit_4', title: 'for Loop & Nested Loops', topic_order: 2, is_completed: true },
            { id: 'top_4_3', unit_id: 'unit_4', title: 'Loop Control (break, continue)', topic_order: 3, is_completed: true },
          ],
        },
        {
          id: 'unit_5',
          syllabus_id: 'syl_c_01',
          title: 'Unit 5 — Arrays',
          unit_number: 5,
          description: 'Single-dimensional arrays, 2D matrices, string handling.',
          topics: [
            { id: 'top_5_1', unit_id: 'unit_5', title: '1D Arrays Declaration & Access', topic_order: 1, is_completed: true },
            { id: 'top_5_2', unit_id: 'unit_5', title: '2D Arrays (Matrix Operations)', topic_order: 2, is_completed: false },
            { id: 'top_5_3', unit_id: 'unit_5', title: 'Character Arrays & Strings', topic_order: 3, is_completed: false },
          ],
        },
        {
          id: 'unit_6',
          syllabus_id: 'syl_c_01',
          title: 'Unit 6 — Functions',
          unit_number: 6,
          description: 'Function definition, declaration, call by value, call by reference, recursion.',
          topics: [
            { id: 'top_6_1', unit_id: 'unit_6', title: 'Function Prototypes & Definitions', topic_order: 1, is_completed: true },
            { id: 'top_6_2', unit_id: 'unit_6', title: 'Call by Value vs Call by Reference', topic_order: 2, is_completed: false },
            { id: 'top_6_3', unit_id: 'unit_6', title: 'Recursion Basics', topic_order: 3, is_completed: false },
          ],
        },
        {
          id: 'unit_7',
          syllabus_id: 'syl_c_01',
          title: 'Unit 7 — Pointers',
          unit_number: 7,
          description: 'Pointer declaration, dereferencing, pointer arithmetic, pointers and arrays.',
          topics: [
            { id: 'top_7_1', unit_id: 'unit_7', title: 'Address-of (&) and Dereference (*)', topic_order: 1, is_completed: false },
            { id: 'top_7_2', unit_id: 'unit_7', title: 'Pointer Arithmetic', topic_order: 2, is_completed: false },
            { id: 'top_7_3', unit_id: 'unit_7', title: 'Pointers with Arrays & Functions', topic_order: 3, is_completed: false },
          ],
        },
      ],
    };

    const demoAssignment: DBAssignment = {
      id: 'asg_01',
      user_id: demoUserId,
      question: 'Write a C program to find the biggest among three numbers using nested if-else.',
      language: 'c',
      subject: 'Computer Applications in Pharmacy',
      topic: 'Conditional Statements',
      purpose: 'Assignment',
      difficulty: 'Basic',
      answer_format: 'Algorithm + Program + Output',
      algorithm:
        '1. Start the program.\n2. Declare three integer variables a, b, and c.\n3. Read three values from the user using scanf().\n4. Check if a >= b:\n   a. If true, check if a >= c. If yes, print "a is largest", otherwise print "c is largest".\n5. If a < b:\n   a. Check if b >= c. If yes, print "b is largest", otherwise print "c is largest".\n6. Return 0 and exit.',
      code: `#include <stdio.h>

int main() {
    int a, b, c;

    // Prompt user for three numbers
    printf("Enter three integer numbers: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3) {
        printf("Invalid input! Please enter integers.\\n");
        return 1;
    }

    // Determine the greatest number using nested if-else
    if (a >= b) {
        if (a >= c) {
            printf("The largest number is %d\\n", a);
        } else {
            printf("The largest number is %d\\n", c);
        }
    } else {
        if (b >= c) {
            printf("The largest number is %d\\n", b);
        } else {
            printf("The largest number is %d\\n", c);
        }
    }

    return 0;
}`,
      explanation:
        'This program uses nested conditional branching. The outer if condition (a >= b) divides the search space into two halves: either a is a candidate for the largest, or b is. In each branch, the inner if checks against the third variable c, arriving at the correct maximum with at most two comparisons.',
      sample_input: '15 42 27',
      sample_output: 'Enter three integer numbers: 15 42 27\nThe largest number is 42',
      result: 'The program successfully compiles with GCC and accurately determines the largest number among three user-supplied integers.',
      viva_questions: [
        'What is the difference between else-if ladder and nested if-else?',
        'Can we write this logic using the ternary operator (?:)? How?',
        'What happens if two or three numbers entered are equal?',
        'Why do we check the return value of scanf() in production C code?',
      ],
      common_mistakes: [
        'Writing `if (a > b > c)` which is invalid syntax in C due to left-to-right relational operator associativity evaluation.',
        'Forgetting the `&` address-of operator in `scanf("%d", &a)`.',
        'Not handling equal inputs correctly by using strict `>` instead of `>=`.',
      ],
      important_concepts: [
        'Nested control flow',
        'Operator associativity and relational evaluation',
        'Input buffer validation in standard I/O',
      ],
      is_favorite: true,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    };

    const demoDoubt: DBDoubt = {
      id: 'dbt_01',
      user_id: demoUserId,
      question: 'What is a pointer in C and why do we use the & operator in scanf?',
      language: 'c',
      answer:
        'A pointer in C is a variable that stores the memory address of another variable rather than a direct value.',
      simple_explanation:
        'Think of your computer memory (RAM) as a giant street with numbered houses. A normal variable like `int age = 20;` puts the value 20 inside house #1040. A pointer is like a piece of paper that says "Look at house #1040". In `scanf("%d", &age)`, C passes parameters by value (it makes a copy). To allow `scanf` to modify the original variable `age`, you must give it the address (`&age`), so it knows which memory box to fill!',
      example: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num; // ptr stores the memory address of num

    printf("Value of num: %d\\n", num);
    printf("Address of num (&num): %p\\n", (void*)&num);
    printf("Value stored in ptr: %p\\n", (void*)ptr);
    printf("Value pointed to by ptr (*ptr): %d\\n", *ptr);

    return 0;
}`,
      related_concepts: ['Memory Addresses', 'Dereferencing (*)', 'Pass by Reference', 'Pointers in Functions'],
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    };

    const demoDebug: DBDebugSession = {
      id: 'dbg_01',
      user_id: demoUserId,
      language: 'c',
      code: `#include <stdio.h>

int main() {
    int a = 10
    int b = 20;
    printf("Sum is: %d\\n", a + b);
    return 0;
}`,
      error_message: "error: expected ';' before 'int'",
      has_error: true,
      error_type: 'Syntax Error (Missing Semicolon)',
      problematic_lines: [4],
      explanation:
        "In C, every statement must end with a semicolon (`;`). Line 4 `int a = 10` is missing a semicolon at the end. The C compiler continues parsing into the next token `int` on line 5 and flags that a semicolon was expected.",
      corrected_code: `#include <stdio.h>

int main() {
    int a = 10; // Added semicolon here
    int b = 20;
    printf("Sum is: %d\\n", a + b);
    return 0;
}`,
      prevention_tip:
        'Always verify statement terminators when declaring multiple variables. Modern IDEs highlight missing semicolons immediately with red squiggly lines.',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    };

    const demoProgress: DBProgress[] = [
      {
        id: 'prog_01',
        user_id: demoUserId,
        topic: 'Operators',
        score: 91,
        accuracy: 91,
        attempts: 20,
        correct_answers: 18,
        incorrect_answers: 2,
        last_practiced: new Date(Date.now() - 3600000 * 6).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'prog_02',
        user_id: demoUserId,
        topic: 'Loops',
        score: 82,
        accuracy: 82,
        attempts: 28,
        correct_answers: 23,
        incorrect_answers: 5,
        last_practiced: new Date(Date.now() - 3600000 * 18).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'prog_03',
        user_id: demoUserId,
        topic: 'Functions',
        score: 67,
        accuracy: 67,
        attempts: 18,
        correct_answers: 12,
        incorrect_answers: 6,
        last_practiced: new Date(Date.now() - 3600000 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'prog_04',
        user_id: demoUserId,
        topic: 'Arrays',
        score: 54,
        accuracy: 54,
        attempts: 24,
        correct_answers: 13,
        incorrect_answers: 11,
        last_practiced: new Date(Date.now() - 3600000 * 48).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'prog_05',
        user_id: demoUserId,
        topic: 'Pointers',
        score: 31,
        accuracy: 31,
        attempts: 16,
        correct_answers: 5,
        incorrect_answers: 11,
        last_practiced: new Date(Date.now() - 3600000 * 72).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const demoFavorite: DBFavorite = {
      id: 'fav_01',
      user_id: demoUserId,
      resource_type: 'assignment',
      resource_id: 'asg_01',
      title: 'Biggest among three numbers using nested if-else',
      language: 'c',
      details: 'Algorithm, C Code, Output and Viva Questions for Lab Assignment',
      created_at: now,
    };

    const demoNotification: DBNotification = {
      id: 'notif_01',
      user_id: demoUserId,
      title: 'Recommended Practice',
      message: 'You should practice Arrays and Pointers more before moving to the next unit.',
      type: 'warning',
      is_read: false,
      link: '/practice?topic=Arrays',
      created_at: now,
    };

    const demoNotification2: DBNotification = {
      id: 'notif_02',
      user_id: demoUserId,
      title: 'Streak Milestone!',
      message: 'You have maintained a 5-day coding streak. Keep solving daily to reach 7 days!',
      type: 'success',
      is_read: true,
      link: '/dashboard',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    };

    return {
      users: [demoUser],
      profiles: [demoProfile],
      syllabi: [demoSyllabus],
      assignments: [demoAssignment],
      doubts: [demoDoubt],
      debug_sessions: [demoDebug],
      practice_sessions: [],
      quizzes: [],
      viva_sessions: [],
      progress: demoProgress,
      favorites: [demoFavorite],
      downloads: [],
      conversations: [],
      messages: [],
      notifications: [demoNotification, demoNotification2],
    };
  }
}

export const dbManager = new DatabaseManager();
