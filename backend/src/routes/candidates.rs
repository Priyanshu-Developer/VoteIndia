

// use actix_multipart::form::MultipartForm;
// use actix_web::{get, patch, post, web::{ Data, Path}, Responder};
// use serde_json::json;
// use sqlx::SqlitePool;

// use crate::{models::candidatemodel::Candidates, routes::structures::{RegisterCandidate, UpdateCandidate}};

// #[post("/register")]
// pub async fn register(payload: MultipartForm<RegisterCandidate>, db: Data<SqlitePool>) -> impl Responder {

//     if payload.id.clone()<= 0  ||  payload.state.clone().is_empty() || payload.candidate_name.clone().is_empty() {
//         return apiresponse::ApiResponse::new(400, "field cannot be empty".to_string());
//     }
//     let candidate = Candidates::new(payload.id.clone(), &payload.state.clone(), &payload.candidate_name.clone());
//     match candidate.save(db).await {
//         Ok(_) => apiresponse::ApiResponse::new(200, "Candidate registered successfully".to_string()),
//         Err(e) => apiresponse::ApiResponse::new(400, e),
        
//     }
    
// }
// #[patch("/update")]
// pub async fn update(payload: MultipartForm<UpdateCandidate>, db: Data<SqlitePool>) -> impl Responder {
//     match Candidates::get(payload.id.0, db.clone()).await {
//         Ok(mut candidate) => {
//             // Update state if provided
//             if let Some(state) = &payload.state {
//                 candidate.state = state.0.clone();
//             }
//             // Update candidate_name if provided
//             if let Some(candidate_name) = &payload.candidate_name {
//                 candidate.candidate_name = candidate_name.0.clone();
//             }
//             // Save updates to database
//             match candidate.save(db).await {
//                 Ok(_) => apiresponse::ApiResponse::new(200, "Update Successful".to_string()),
//                 Err(e) => apiresponse::ApiResponse::new(400, format!("Failed to update: {}", e)),
//             }
//         }
//         Err(_) => apiresponse::ApiResponse::new(404, "Candidate not found".to_string()),
//     }
// }


// #[get("/get/{id}")]
// pub async fn get(db: Data<SqlitePool>, id: Path<i64>) -> impl Responder {
//     match Candidates::get(id.into_inner(), db.clone()).await {
//         Ok(candidate) => {
//             let response_data = json!({
//                 "id": candidate.id,
//                 "state": candidate.state,
//                 "candidate_name": candidate.candidate_name,
//             });

//             apiresponse::ApiResponse::new(200, response_data.to_string())
//         }
//         Err(_) => apiresponse::ApiResponse::new(404, "Candidate not found".to_string()),
//     }
// }

