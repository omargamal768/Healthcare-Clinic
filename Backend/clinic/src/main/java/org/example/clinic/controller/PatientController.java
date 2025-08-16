package org.example.clinic.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.example.clinic.dto.PatientDTO;
import org.example.clinic.services.PatientService;
import org.example.clinic.utils.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.example.clinic.model.Patient;

@RestController
@RequestMapping("/admin/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

// Dependency Injection
 private final PatientService patientService;
 @Autowired
 public PatientController(PatientService patientService) {
  this.patientService = patientService;
 }
//******************************************************************************************************

 //API to return the list of all patients
 @CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access this
 @GetMapping("/")
 public ResponseEntity<Map<String, Object>> getAllPatients(
         @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "10") int size) {

  Pageable pageable = PageRequest.of(page, size);
  Page<PatientDTO> pagePatients = patientService.getAllPatients(pageable);

  Map<String, Object> response = new HashMap<>();
  response.put("status", "success");
  response.put("data", pagePatients.getContent());
  response.put("total", pagePatients.getTotalElements()); // For frontend pagination
  response.put("currentPage", page);
  response.put("totalPages", pagePatients.getTotalPages());

  return ResponseEntity.ok(response);
 }

//******************************************************************************************************

//API to insert new patient or update current patient using id
 @PostMapping("/")
 public ResponseEntity<?> saveOrUpdatePatient(@Valid @RequestBody PatientDTO patientDTO, BindingResult result) {
  if (result.hasErrors()) {Map<String, String> errors = new HashMap<>();
   for (FieldError error : result.getFieldErrors()) {errors.put(error.getField(), error.getDefaultMessage());}
   return ResponseEntity.badRequest().body(errors);}
  Patient patientEntity = PatientMapper.toEntity(patientDTO);
  Patient savedPatient = patientService.saveOrUpdatePatient(patientEntity);
  PatientDTO savedPatientDTO = PatientMapper.toDTO(savedPatient);
  boolean isNew = (patientDTO.getId() == null || patientDTO.getId() == 0);
  return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK) // 201 for new, 200 for update
          .body(Map.of("message", isNew ? "✅ Patient created successfully!" : "✅ Patient updated successfully!",
                  "patient", savedPatientDTO));}
 //*********************************************************************************************************************

 //API to delete patient by id
 @DeleteMapping("/{id}")
 public ResponseEntity<?> deletePatient(@PathVariable Long id) {
  PatientDTO patient = patientService.findById(id);
  if (patient==null) {return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",
           "❌ Patient not found with ID " + id));}
  patientService.deleteById(id);
  return ResponseEntity.ok(Map.of("message", "✅ Patient deleted successfully", "deletedPatient", patient));}
//*****************************************************************************************************************

//Api return JSON object of patient by mobile
 @GetMapping("/mobile/{mobile}")
 public ResponseEntity<PatientDTO> getPatientByMobile(@PathVariable String mobile) {
  PatientDTO patientDTO = patientService.getPatientByMobile(mobile);
  return ResponseEntity.ok(patientDTO);}
//*******************************************************************************************

 //Api return JSON object of patient by id
 @GetMapping("/{id}")
 public ResponseEntity<PatientDTO> getPatientById(@PathVariable @Min(1) Long id) {
  PatientDTO patientDTO = patientService.findById(id);
  return ResponseEntity.ok(patientDTO);}
 //**************************************************************************************************
//Api return JSON object of patient by name
 @GetMapping("/name/{name}")
 public ResponseEntity<List<PatientDTO>> getPatientsByName(@PathVariable String name) {
  List<PatientDTO> patientDTOs = patientService.getPatientsByName(name);
  return ResponseEntity.ok(patientDTOs);
 }


}

