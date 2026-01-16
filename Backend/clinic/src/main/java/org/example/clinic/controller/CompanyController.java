package org.example.clinic.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.example.clinic.dto.CompanyDTO;
import org.example.clinic.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/companies")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {

    private static final Logger logger = LogManager.getLogger(CompanyController.class);

    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
        logger.info("CompanyController initialized");
    }

    @GetMapping("/")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        logger.trace("GET /admin/api/companies/ - Request received");
        try {
            List<CompanyDTO> companies = companyService.getAllCompanies();
            logger.debug("Retrieved {} companies", companies.size());
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            logger.error("Error getting all companies", e);
            throw e;
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<CompanyDTO>> getActiveCompanies() {
        logger.trace("GET /admin/api/companies/active - Request received");
        try {
            List<CompanyDTO> companies = companyService.getActiveCompanies();
            logger.debug("Retrieved {} active companies", companies.size());
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            logger.error("Error getting active companies", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Long id) {
        logger.trace("GET /admin/api/companies/{} - Request received", id);
        try {
            CompanyDTO company = companyService.findById(id);
            logger.debug("Company found: ID={}, Name={}", id, company.getName());
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            logger.error("Error getting company by ID: {}", id, e);
            throw e;
        }
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<CompanyDTO> getCompanyStatistics(
            @PathVariable Long id,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        logger.trace("GET /admin/api/companies/{}/statistics - Request received", id);
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            CompanyDTO company = companyService.getCompanyWithStatistics(id, start, end);
            logger.debug("Company statistics retrieved: ID={}, TotalPatients={}, PatientsNeedingPapers={}", 
                    id, company.getTotalPatients(), company.getPatientsNeedingPapers());
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            logger.error("Error getting company statistics: ID={}", id, e);
            throw e;
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> saveOrUpdateCompany(@Valid @RequestBody CompanyDTO companyDTO) {
        logger.trace("POST /admin/api/companies/ - Request received: {}", companyDTO);
        
        try {
            boolean isNew = (companyDTO.getId() == null || companyDTO.getId() == 0);
            CompanyDTO saved = companyService.saveOrUpdateCompany(companyDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", isNew ? "✅ Company created successfully!" : "✅ Company updated successfully!");
            response.put("company", saved);
            
            logger.info("Company {} successfully: ID={}, Name={}", 
                    isNew ? "created" : "updated", saved.getId(), saved.getName());
            
            return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(response);
        } catch (Exception e) {
            logger.error("Error saving/updating company: {}", companyDTO, e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        logger.trace("DELETE /admin/api/companies/{} - Request received", id);
        
        try {
            companyService.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "✅ Company deleted successfully");
            logger.info("Company deleted successfully: ID={}", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting company: ID={}", id, e);
            throw e;
        }
    }
}
