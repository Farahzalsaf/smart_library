import streamlit as st
import requests
import uuid

st.title("Chat with Lucky!")


if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

session_id = st.session_state.session_id

if "messages" not in st.session_state:
    st.session_state.messages = []

def get_response(query):
    try:
        response = requests.post(
            "http://127.0.0.1:8000/chat",
            json={"query": query, "session_id": session_id},
            timeout=30  
        )
        response.raise_for_status()
        response_json = response.json()
        if "response" in response_json:
            return response_json["response"]
        else:
            return "Error: No response found in server reply."
    except requests.exceptions.RequestException as e:
        st.error(f"Request failed: {e}")
        return "Error: Request failed."
    except ValueError:
        st.error("Error: Unable to decode JSON response from server.")
        return "Error: Unable to decode JSON response from server."


for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


if prompt := st.chat_input("Hi, how can I assist you today?"):

    st.chat_message("user").markdown(prompt)

    st.session_state.messages.append({"role": "user", "content": prompt})

    response = get_response(prompt)

    with st.chat_message("assistant"):
        st.markdown(response)

    st.session_state.messages.append({"role": "assistant", "content": response})