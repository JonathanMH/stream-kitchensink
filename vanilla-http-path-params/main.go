package main

import (
	"fmt"
	"net/http"
	"slices"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/hello-world", helloHandler)
	mux.HandleFunc("/users/{id}", userHandler)

	http.ListenAndServe(":3666", mux)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World!"))
}

func userHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.PathValue("id")
	fmt.Println("got userId:", userId)
	knownUserIds := []string{"1", "2", "3"}
	if slices.Contains(knownUserIds, userId) {
		w.Write([]byte(fmt.Sprintf("user with id %s has been found!", userId)))
		return
	}
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(fmt.Sprintf("user with id %s has not been found!", userId)))
}
