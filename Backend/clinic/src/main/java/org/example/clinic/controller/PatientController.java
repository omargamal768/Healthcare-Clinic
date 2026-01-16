package org.example.clinic.controller;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

    private static final Logger logger = LogManager.getLogger(PatientController.class);

// Dependency Injection
 private final PatientService patientService;
 @Autowired
 public PatientController(PatientService patientService) {
  this.patientService = patientService;
  logger.info("PatientController initialized");
 }
//******************************************************************************************************

 //API to return the list of all patients
 @CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access this
 @GetMapping("/")
 public ResponseEntity<Map<String, Object>> getAllPatients(
         @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "10") int size) {
  logger.trace("GET /admin/api/patients/ - Request received with page={}, size={}", page, size);
  
  try {
      Pageable pageable = PageRequest.of(page, size);
      Page<PatientDTO> pagePatients = patientService.getAllPatients(pageable);
      
      logger.debug("Retrieved {} patients (page {} of {})", 
              pagePatients.getTotalElements(), page, pagePatients.getTotalPages());

      Map<String, Object> response = new HashMap<>();
      response.put("status", "success");
      response.put("data", pagePatients.getContent());
      response.put("total", pagePatients.getTotalElements()); // For frontend pagination
      response.put("currentPage", page);
      response.put("totalPages", pagePatients.getTotalPages());

      logger.trace("GET /admin/api/patients/ - Response: {}", response);
      return ResponseEntity.ok(response);
  } catch (Exception e) {
      logger.error("Error getting all patients: page={}, size={}", page, size, e);
      throw e;
  }
 }

//******************************************************************************************************

//API to insert new patient or update current patient using id
 @PostMapping("/")
 public ResponseEntity<?> saveOrUpdatePatient(@Valid @RequestBody PatientDTO patientDTO, BindingResult result) {
  logger.trace("POST /admin/api/patients/ - Request received: {}", patientDTO);
  
  if (result.hasErrors()) {
      Map<String, String> errors = new HashMap<>();
      for (FieldError error : result.getFieldErrors()) {
          errors.put(error.getField(), error.getDefaultMessage());
          logger.warn("Validation error for field '{}': {}", error.getField(), error.getDefaultMessage());
      }
      logger.error("POST /admin/api/patients/ - Validation failed: {}", errors);
      return ResponseEntity.badRequest().body(errors);
  }
  
  try {
      boolean isNew = (patientDTO.getId() == null || patientDTO.getId() == 0);
      logger.debug("{} patient: ID={}, Name={}, Mobile={}", 
              isNew ? "Creating" : "Updating", patientDTO.getId(), patientDTO.getName(), patientDTO.getMobile());
      
      Patient patientEntity = PatientMapper.toEntity(patientDTO);
      Patient savedPatient = patientService.saveOrUpdatePatient(patientEntity);
      PatientDTO savedPatientDTO = PatientMapper.toDTO(savedPatient);
      
      Map<String, Object> response = new HashMap<>();
      response.put("message", isNew ? "✅ Patient created successfully!" : "✅ Patient updated successfully!");
      response.put("patient", savedPatientDTO);
      
      logger.info("Patient {} successfully: ID={}, Name={}, Mobile={}", 
              isNew ? "created" : "updated", savedPatientDTO.getId(), savedPatientDTO.getName(), savedPatientDTO.getMobile());
      logger.trace("POST /admin/api/patients/ - Response: {}", response);
      
      return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(response);
  } catch (Exception e) {
      logger.error("Error saving/updating patient: {}", patientDTO, e);
      throw e;
  }
}
 //*********************************************************************************************************************

 //API to delete patient by id
 @DeleteMapping("/{id}")
 public ResponseEntity<?> deletePatient(@PathVariable Long id) {
  logger.trace("DELETE /admin/api/patients/{} - Request received", id);
  
  try {
      PatientDTO patient = patientService.findById(id);
      if (patient==null) {
          logger.warn("DELETE /admin/api/patients/{} - Patient not found", id);
          Map<String, String> errorResponse = new HashMap<>();
          errorResponse.put("message", "❌ Patient not found with ID " + id);
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
      }
      
      logger.debug("Deleting patient: ID={}, Name={}, Mobile={}", id, patient.getName(), patient.getMobile());
      patientService.deleteById(id);
      
      Map<String, Object> response = new HashMap<>();
      response.put("message", "✅ Patient deleted successfully");
      response.put("deletedPatient", patient);
      
      logger.info("Patient deleted successfully: ID={}, Name={}, Mobile={}", id, patient.getName(), patient.getMobile());
      logger.trace("DELETE /admin/api/patients/{} - Response: {}", id, response);
      
      return ResponseEntity.ok(response);
  } catch (Exception e) {
      logger.error("Error deleting patient with ID: {}", id, e);
      throw e;
  }
}
//*****************************************************************************************************************

//Api return JSON object of patient by mobile
 @GetMapping("/mobile/{mobile}")
 public ResponseEntity<PatientDTO> getPatientByMobile(@PathVariable String mobile) {
  logger.trace("GET /admin/api/patients/mobile/{} - Request received", mobile);
  
  try {
      PatientDTO patientDTO = patientService.getPatientByMobile(mobile);
      logger.debug("Patient found by mobile {}: ID={}, Name={}", mobile, patientDTO.getId(), patientDTO.getName());
      logger.trace("GET /admin/api/patients/mobile/{} - Response: {}", mobile, patientDTO);
      return ResponseEntity.ok(patientDTO);
  } catch (Exception e) {
      logger.error("Error getting patient by mobile: {}", mobile, e);
      throw e;
  }
}
//*******************************************************************************************

 //Api return JSON object of patient by id
 @GetMapping("/{id}")
 public ResponseEntity<PatientDTO> getPatientById(@PathVariable @Min(1) Long id) {
  logger.trace("GET /admin/api/patients/{} - Request received", id);
  
  try {
      PatientDTO patientDTO = patientService.findById(id);
      logger.debug("Patient found by ID {}: Name={}, Mobile={}", id, patientDTO.getName(), patientDTO.getMobile());
      logger.trace("GET /admin/api/patients/{} - Response: {}", id, patientDTO);
      return ResponseEntity.ok(patientDTO);
  } catch (Exception e) {
      logger.error("Error getting patient by ID: {}", id, e);
      throw e;
  }
}
 //**************************************************************************************************
//Api return JSON object of patient by name
 @GetMapping("/name/{name}")
 public ResponseEntity<List<PatientDTO>> getPatientsByName(@PathVariable String name) {
  logger.trace("GET /admin/api/patients/name/{} - Request received", name);
  
  try {
      List<PatientDTO> patientDTOs = patientService.getPatientsByName(name);
      logger.debug("Found {} patients with name containing '{}'", patientDTOs.size(), name);
      logger.trace("GET /admin/api/patients/name/{} - Response: {} patients", name, patientDTOs.size());
      return ResponseEntity.ok(patientDTOs);
  } catch (Exception e) {
      logger.error("Error getting patients by name: {}", name, e);
      throw e;
  }
 }


}

