package org.example.clinic.services;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.example.clinic.dto.PatientDTO;
import org.example.clinic.model.Patient;
import org.example.clinic.repo.PatientRepository;
import org.example.clinic.utils.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private static final Logger logger = LogManager.getLogger(PatientService.class);

//Dependency Injection
    private final PatientRepository patientRepository;
    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
        logger.info("PatientService initialized");
    }
//******************************************************************************************************

//Method return list of all patients

public Page<PatientDTO> getAllPatients(Pageable pageable) {
    logger.trace("Getting all patients with pageable: page={}, size={}", 
            pageable.getPageNumber(), pageable.getPageSize());
    
    try {
        Page<PatientDTO> result = patientRepository.findAll(pageable)
                .map(PatientMapper::toDTO);
        logger.debug("Retrieved {} patients from database", result.getTotalElements());
        return result;
    } catch (Exception e) {
        logger.error("Error getting all patients", e);
        throw e;
    }
}
//***********************************************************************************************************

//Method save new patient or update by id
public Patient saveOrUpdatePatient(Patient patient) {
    logger.trace("Saving/updating patient: ID={}, Name={}, Mobile={}", 
            patient.getId(), patient.getName(), patient.getMobile());
    
    if (patient.getId() == null || patient.getId() == 0) {
        // Creating a new patient - Check if mobile already exists
        logger.debug("Creating new patient with mobile: {}", patient.getMobile());
        if (patientRepository.existsByMobile(patient.getMobile())) {
            logger.warn("Attempt to create patient with existing mobile: {}", patient.getMobile());
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "❌ A patient with mobile " + patient.getMobile() + " already exists.");}
        Patient saved = patientRepository.save(patient);
        logger.info("New patient created: ID={}, Name={}, Mobile={}", 
                saved.getId(), saved.getName(), saved.getMobile());
        return saved;
    } else {
        // Updating an existing patient
        logger.debug("Updating existing patient with ID: {}", patient.getId());
        Optional<Patient> existingPatientOpt = patientRepository.findById(patient.getId());
        if (existingPatientOpt.isPresent()) {
            Patient existingPatient = existingPatientOpt.get();
            logger.debug("Existing patient found: ID={}, Name={}, Mobile={}", 
                    existingPatient.getId(), existingPatient.getName(), existingPatient.getMobile());
            
            // Prevent duplicate mobile number update
            if (!existingPatient.getMobile().equals(patient.getMobile()) && patientRepository.existsByMobile(patient.getMobile())) {
                logger.warn("Attempt to update patient {} with existing mobile: {}", patient.getId(), patient.getMobile());
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "❌ A patient with mobile " + patient.getMobile() + " already exists.");}
            // Update fields
            existingPatient.setName(patient.getName());
            existingPatient.setMobile(patient.getMobile());
            Patient saved = patientRepository.save(existingPatient);
            logger.info("Patient updated: ID={}, Name={}, Mobile={}", 
                    saved.getId(), saved.getName(), saved.getMobile());
            return saved;
        } else {
            logger.error("Patient not found for update: ID={}", patient.getId());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ Patient not found with ID " + patient.getId());}
    }
}
//*********************************************************************************************************************

//Method find patient by his id
public PatientDTO findById(Long id) {
    logger.trace("Finding patient by ID: {}", id);
    
    try {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Patient not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "❌ Patient not found with ID " + id);
                });
        logger.debug("Patient found by ID {}: Name={}, Mobile={}", id, patient.getName(), patient.getMobile());
        return PatientMapper.toDTO(patient);
    } catch (Exception e) {
        logger.error("Error finding patient by ID: {}", id, e);
        throw e;
    }
}

//  *******************************************************************************************************

//Method to delete a patient by ID
    public void deleteById(Long id) {
    logger.trace("Deleting patient by ID: {}", id);
    
    try {
        if (!patientRepository.existsById(id)) {
            logger.warn("Attempt to delete non-existent patient: ID={}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ Patient not found with ID " + id);
        }
        patientRepository.deleteById(id);
        logger.info("Patient deleted successfully: ID={}", id);
    } catch (Exception e) {
        logger.error("Error deleting patient by ID: {}", id, e);
        throw e;
    }
}
//*********************************************************************************************************************

//Method to return a patient object by his mobile
public PatientDTO getPatientByMobile(String mobile) {
    logger.trace("Finding patient by mobile: {}", mobile);
    
    try {
        Patient patient = patientRepository.findByMobileContaining(mobile)
                .orElseThrow(() -> {
                    logger.warn("Patient not found with mobile: {}", mobile);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "❌ Patient not found with mobile " + mobile);
                });
        logger.debug("Patient found by mobile {}: ID={}, Name={}", mobile, patient.getId(), patient.getName());
        return PatientMapper.toDTO(patient);
    } catch (Exception e) {
        logger.error("Error finding patient by mobile: {}", mobile, e);
        throw e;
    }
}
//*********************************************************************************************************************
//Method to return a patient object by his name
public List<PatientDTO> getPatientsByName(String name) {
    logger.trace("Finding patients by name: {}", name);
    
    try {
        List<Patient> patients = patientRepository.findByNameContaining(name);
        if (patients.isEmpty()) {
            logger.warn("No patients found with name containing: {}", name);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ No patients found with name containing: " + name);
        }
        logger.debug("Found {} patients with name containing '{}'", patients.size(), name);
        return patients.stream()
                .map(PatientMapper::toDTO)
                .collect(Collectors.toList());
    } catch (Exception e) {
        logger.error("Error finding patients by name: {}", name, e);
        throw e;
    }
}


}