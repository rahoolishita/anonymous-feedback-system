import pymongo
import random
from datetime import datetime, timedelta
import bcrypt
from bson import ObjectId

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["feedback_system"]

# Sample data
departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]

manager_names = [
    "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", 
    "Jessica Williams", "Robert Taylor", "Amanda Davis", "James Wilson"
]

employee_names = [
    "Alex Thompson", "Maria Garcia", "John Smith", "Lisa Anderson",
    "Kevin Brown", "Rachel Green", "Daniel Lee", "Sophie Miller",
    "Chris Johnson", "Anna Martinez", "Ryan Davis", "Emma Wilson",
    "Tyler Moore", "Olivia Taylor", "Brandon Clark", "Megan Lewis",
    "Jordan White", "Hannah Scott", "Austin Hall", "Grace Adams",
    "Nathan Young", "Chloe King", "Ethan Wright", "Zoe Turner",
    "Lucas Hill", "Ava Parker", "Mason Cooper", "Isabella Reed",
    "Logan Bailey", "Sophia Cox", "Connor Ward", "Mia Foster"
]

feedback_templates = {
    'positive': [
        "Great job on the recent project! Your attention to detail was impressive.",
        "I really appreciate your quick response to client requests.",
        "The presentation you gave was excellent and well-prepared.",
        "Thank you for your leadership during the team meeting.",
        "Your collaborative approach has made a big difference to our team.",
        "I'm grateful for your support on the new initiative.",
        "The process improvements you suggested are working great.",
        "Your technical expertise has been invaluable to the project.",
        "Thanks for going above and beyond to meet the deadline.",
        "Your positive attitude contributes greatly to team morale.",
        "The training session you conducted was very informative.",
        "I appreciate your flexibility with the schedule changes.",
        "Your problem-solving skills helped us overcome major obstacles.",
        "The quality of your work consistently exceeds expectations.",
        "Thank you for mentoring the new team members so effectively."
    ],
    'negative': [
        "I'm concerned about the delays in our current project timeline.",
        "Communication during team meetings could be improved.",
        "I feel like my concerns aren't being addressed properly.",
        "The workload distribution seems uneven lately.",
        "I'm frustrated with the lack of clear direction on this project.",
        "The feedback process needs to be more structured and timely.",
        "I'm having difficulty accessing the resources I need to do my job.",
        "Recent meetings have been unproductive and too lengthy.",
        "I feel overwhelmed with the current workload expectations.",
        "The decision-making process is taking longer than necessary.",
        "I'm not satisfied with the current work environment.",
        "Project expectations are unclear and frequently changing.",
        "I feel like my input isn't valued in team discussions.",
        "The tools we're using are outdated and slowing us down.",
        "There's a lack of professional development opportunities available."
    ]
}

question_templates = [
    "What are the plans for team expansion in the next quarter?",
    "Can we discuss flexible work arrangements for the team?",
    "How can we improve our current project management process?",
    "What training opportunities are available for skill development?",
    "Can we review the current performance evaluation criteria?",
    "What's the timeline for implementing the new software tools?",
    "How can we better collaborate with other departments?",
    "What are the priorities for our team in the coming months?",
    "Can we discuss the budget allocation for our upcoming projects?",
    "How can we improve work-life balance for the team?",
    "What metrics are we using to measure project success?",
    "Can we establish clearer communication protocols?",
    "What are the career advancement opportunities in our department?",
    "How can we streamline our current workflow processes?",
    "What support is available for remote work challenges?"
]

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_users():
    print("Creating users...")
    users_collection = db.users
    
    # Clear existing users
    users_collection.delete_many({})
    
    created_users = []
    
    # Create managers
    managers = []
    for i, name in enumerate(manager_names):
        email = f"{name.lower().replace(' ', '.')}@company.com"
        manager = {
            "email": email,
            "name": name,
            "password": hash_password("password123"),
            "role": "manager",
            "department": departments[i % len(departments)],
            "createdAt": datetime.now() - timedelta(days=random.randint(30, 365))
        }
        result = users_collection.insert_one(manager)
        manager['_id'] = result.inserted_id
        managers.append(manager)
        created_users.append(manager)
    
    # Create employees
    employees = []
    for i, name in enumerate(employee_names):
        email = f"{name.lower().replace(' ', '.')}@company.com"
        # Assign random manager from same or different department
        manager = random.choice(managers)
        employee = {
            "email": email,
            "name": name,
            "password": hash_password("password123"),
            "role": "employee",
            "managerId": str(manager['_id']),
            "department": manager['department'] if random.random() > 0.3 else random.choice(departments),
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 300))
        }
        result = users_collection.insert_one(employee)
        employee['_id'] = result.inserted_id
        employees.append(employee)
        created_users.append(employee)
    
    print(f"Created {len(managers)} managers and {len(employees)} employees")
    return managers, employees

def create_feedback(managers, employees):
    print("Creating feedback entries...")
    feedback_collection = db.feedback
    
    # Clear existing feedback
    feedback_collection.delete_many({})
    
    feedback_entries = []
    
    # Generate 1000+ feedback entries
    for i in range(1200):
        employee = random.choice(employees)
        
        # Find employee's manager or random manager
        if random.random() > 0.2:  # 80% to direct manager
            manager_id = employee['managerId']
        else:  # 20% to other managers
            manager_id = str(random.choice(managers)['_id'])
        
        # Determine if it's feedback or question
        is_question = random.random() < 0.3  # 30% questions, 70% feedback
        
        if is_question:
            content = random.choice(question_templates)
            feedback_type = "question"
            sentiment = None
            sentiment_score = None
        else:
            # Determine sentiment (60% positive, 40% negative)
            is_positive = random.random() < 0.6
            sentiment_type = 'positive' if is_positive else 'negative'
            content = random.choice(feedback_templates[sentiment_type])
            feedback_type = "feedback"
            sentiment = sentiment_type
            sentiment_score = random.uniform(0.7, 0.95) if is_positive else random.uniform(0.6, 0.9)
        
        # Create feedback entry
        feedback_entry = {
            "employeeId": str(employee['_id']),
            "managerId": manager_id,
            "content": content,
            "type": feedback_type,
            "sentiment": sentiment,
            "sentimentScore": sentiment_score,
            "isAnonymous": random.random() < 0.7,  # 70% anonymous
            "createdAt": datetime.now() - timedelta(
                days=random.randint(0, 90),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
        }
        
        # Add response for some feedback (40% response rate)
        if random.random() < 0.4:
            response_templates = [
                "Thank you for your feedback. I'll look into this matter.",
                "I appreciate you bringing this to my attention. Let's discuss this further.",
                "Thanks for the positive feedback! Keep up the great work.",
                "I understand your concerns. Let's schedule a meeting to address them.",
                "Your suggestion is valuable. I'll consider implementing it.",
                "Thank you for your question. Here's what I can share about this topic.",
                "I'm glad to hear about your positive experience. Well done!",
                "Let's work together to improve this situation.",
                "Your feedback helps me understand the team's perspective better.",
                "I'll make sure to address this in our next team meeting."
            ]
            
            feedback_entry["response"] = random.choice(response_templates)
            feedback_entry["respondedAt"] = feedback_entry["createdAt"] + timedelta(
                days=random.randint(1, 7),
                hours=random.randint(0, 23)
            )
        
        feedback_entries.append(feedback_entry)
    
    # Insert all feedback entries
    result = feedback_collection.insert_many(feedback_entries)
    print(f"Created {len(result.inserted_ids)} feedback entries")
    
    return feedback_entries

def print_statistics(managers, employees, feedback_entries):
    print("\n" + "="*50)
    print("DATABASE SEEDING COMPLETED")
    print("="*50)
    print(f"Total Managers: {len(managers)}")
    print(f"Total Employees: {len(employees)}")
    print(f"Total Feedback Entries: {len(feedback_entries)}")
    
    # Feedback statistics
    questions = [f for f in feedback_entries if f['type'] == 'question']
    feedback_items = [f for f in feedback_entries if f['type'] == 'feedback']
    positive_feedback = [f for f in feedback_items if f.get('sentiment') == 'positive']
    negative_feedback = [f for f in feedback_items if f.get('sentiment') == 'negative']
    responded_items = [f for f in feedback_entries if 'response' in f]
    anonymous_items = [f for f in feedback_entries if f['isAnonymous']]
    
    print(f"\nFeedback Breakdown:")
    print(f"  Questions: {len(questions)}")
    print(f"  Feedback: {len(feedback_items)}")
    print(f"    - Positive: {len(positive_feedback)}")
    print(f"    - Negative: {len(negative_feedback)}")
    print(f"  Responded: {len(responded_items)}")
    print(f"  Anonymous: {len(anonymous_items)}")
    
    print(f"\nSample Login Credentials:")
    print(f"Manager: {managers[0]['email']} / password123")
    print(f"Employee: {employees[0]['email']} / password123")
    print("\n" + "="*50)

def main():
    try:
        print("Starting database seeding...")
        print("Connecting to MongoDB...")
        
        # Test connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        
        # Create users
        managers, employees = create_users()
        
        # Create feedback
        feedback_entries = create_feedback(managers, employees)
        
        # Print statistics
        print_statistics(managers, employees, feedback_entries)
        
    except Exception as e:
        print(f"Error during database seeding: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
