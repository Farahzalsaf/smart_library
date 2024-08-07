from services.llm import generate_response
from common.CRUD.add_booksCrud import similarity_text, add_book_to_vectorDB
from services.llm import Intents, detect_intent


class Chatbot:
    def __init__(self):
        self.store = {}

    def handle_query(self, session_id, query):
        intent = detect_intent(query)

        if intent == Intents.ADD_BOOK:
            response = self.handle_add_book(query)
        elif intent == Intents.GET_RECOMMENDATIONS:
            response = self.handle_get_recommendations(query)
        elif intent == Intents.GET_SUMMARY:
            response = self.handle_get_summary(session_id, query)
        elif intent == Intents.CHITCHAT:
            response = self.handle_chitchat(query)
        else:
            system_prompt = "Hi, how can I assist you today?"
            response = generate_response(system_prompt, session_id, query)

        return response

    def handle_add_book(self, query):
        try:
            details = self.parse_book_details(query)
            if not details:
                return "Invalid book details provided."

            title = details.get("title")
            authors = details.get("authors")
            categories = details.get("categories")
            description = details.get("description")

            if not title or not authors or not categories or not description:
                return "Missing book details. Please provide title, authors, categories, and description."

            add_book_to_vectorDB(title, authors, categories, description)
            return "Book added successfully!"
        except Exception as e:
            return f"An error occurred while adding the book: {str(e)}"

    def parse_book_details(self, query):
        details = {}
        parts = query.split(",")
        for part in parts:
            key_value = part.split(":")
            if len(key_value) == 2:
                key = key_value[0].strip().lower()
                value = key_value[1].strip()
                details[key] = value
        return details

    def handle_get_recommendations(self, query):
        recommendations = self.get_recommendations(query)
        return {"recommendations": recommendations}

    def handle_get_summary(self, session_id, query):
        system_prompt = "summary"
        summary = generate_response(system_prompt, session_id, query)
        return summary

    def get_recommendations(self, query):
        similar_items = similarity_text(query)
        return similar_items

    def handle_chitchat(self, query):
        pass

def handle_get_recommendations(self, query):
    recommendations = self.get_recommendations(query)
    filters = self.parse_filters(query)
    filtered_recommendations = [rec for rec in recommendations if self.apply_filters(rec, filters)]
    return {"recommendations": filtered_recommendations}

def parse_filters(query):
    filters = {}
    parts = query.split(",")
    for part in parts:
        key_value = part.split(":")
        if len(key_value) == 2:
            key = key_value[0].strip().lower()
            value = key_value[1].strip()
            filters[key] = value
    return filters

def apply_filters(rec, filters):
    for key, value in filters.items():
        if rec.get(key) != value:
            return False
    return True