import pytest
from datetime import datetime, UTC

class TestBasicEndpoints:
    """Test basic API endpoints"""
    def test_api_root(self, client):
        """Test API root endpoint"""
        response = client.get('/api/')
        assert response.status_code == 200
        assert 'version' in response.json
        assert response.json['status'] == 'operational'

class TestDashboardEndpoints:
    """Test dashboard related endpoints""" 
    def test_dashboard_overview(self, client):
        """Test dashboard overview"""
        response = client.get('/api/dashboard')
        assert response.status_code == 200
        assert 'total_words' in response.json['data']
        assert 'total_groups' in response.json['data']
        assert 'total_study_sessions' in response.json['data']
    
    def test_dashboard_statistics(self, client):
        """Test dashboard statistics"""
        response = client.get('/api/dashboard/statistics')
        assert response.status_code == 200
        assert 'average_score' in response.json['data']
        assert 'total_reviews' in response.json['data']
    
    def test_study_progress(self, client):
        """Test study progress"""
        response = client.get('/api/dashboard/study-progress')
        assert response.status_code == 200
        assert 'progress' in response.json['data']
    
    def test_last_session(self, client, sample_study_session):
        """Test last session endpoint"""
        response = client.get('/api/dashboard/last-session')
        assert response.status_code == 200
        assert 'data' in response.json
        assert 'id' in response.json['data']
        assert 'score' in response.json['data']

    def test_empty_dashboard(self, client):
        """Test dashboard with no data"""
        response = client.get('/api/dashboard')
        assert response.status_code == 200
        assert response.json['data']['total_words'] == 0
        assert response.json['data']['total_groups'] == 0

class TestWordEndpoints:
    """Test word related endpoints"""
    def test_word_listing(self, client, sample_words):
        """Test word listing endpoint"""
        response = client.get('/api/words')
        assert response.status_code == 200
        assert len(response.json['data']['words']) > 0
    
    def test_single_word(self, client, sample_words):
        """Test single word retrieval"""
        word_id = sample_words[0].id
        response = client.get(f'/api/words/{word_id}')
        assert response.status_code == 200
        assert response.json['data']['id'] == word_id
    
    def test_word_groups(self, client, sample_words, sample_groups):
        """Test word groups endpoint"""
        word_id = sample_words[0].id
        response = client.get(f'/api/words/{word_id}/groups')
        assert response.status_code == 200
        assert 'word_groups' in response.json['data']

    def test_word_listing_pagination(self, client, sample_words):
        """Test word listing pagination"""
        response = client.get('/api/words?page=1&per_page=1')
        assert response.status_code == 200
        assert len(response.json['data']['words']) == 1
        assert 'meta' in response.json
        assert response.json['meta']['pagination']['per_page'] == 1
    
    def test_word_not_found(self, client):
        """Test non-existent word retrieval"""
        response = client.get('/api/words/999')
        assert response.status_code == 404
        assert response.json['error_code'] == 'NOT_FOUND'

class TestGroupEndpoints:
    """Test group related endpoints"""
    def test_group_listing(self, client, sample_groups):
        """Test group listing endpoint"""
        response = client.get('/api/groups')
        
        assert response.status_code == 200
        data = response.json['data']
        meta = response.json['meta']
        
        # Debug the response
        print("Response data:", data)  # Add this line to see the actual response
        print("Meta:", meta)            # Add this line to see the actual response
        # Check main structure
        assert 'word_groups' in data, f"Expected 'word_groups' in {data.keys()}"
        assert 'pagination' in meta, f"Expected 'pagination' in {meta.keys()}"
        assert isinstance(data['word_groups'], list)
        assert len(data['word_groups']) > 0
        # Verify group data structure
        first_group = data['word_groups'][0]
        expected_fields = ['id', 'name', 'description', 'total_words']
        for field in expected_fields:
            assert field in first_group
        
        # Verify pagination structure
        expected_pagination_fields = ['page', 'per_page', 'total_pages', 
                                   'has_next', 'has_previous']
        for field in expected_pagination_fields:
            assert field in meta['pagination']

    def test_single_group(self, client, sample_groups):
        """Test single group retrieval"""
        group_id = sample_groups[0].id
        response = client.get(f'/api/groups/{group_id}')
        
        assert response.status_code == 200
        data = response.json['data']
        
        # Verify group data structure
        expected_fields = ['id', 'name', 'description', 'statistics']
        for field in expected_fields:
            assert field in data
            
        # Verify statistics structure
        expected_stats_fields = ['correct_count', 'wrong_count', 'total_count']
        for field in expected_stats_fields:
            assert field in data['statistics']

    def test_group_not_found(self, client):
        """Test non-existent group retrieval"""
        response = client.get('/api/groups/999')
        assert response.status_code == 404
        assert response.json['error_code'] == 'NOT_FOUND'
    
    def test_group_words(self, client, sample_groups, sample_words):
        """Test group words endpoint"""
        group_id = sample_groups[0].id
        response = client.get(f'/api/groups/{group_id}/words')
        
        assert response.status_code == 200
        data = response.json['data']
        meta = response.json['meta']
        assert 'words' in data
        assert 'pagination' in meta
        assert isinstance(data['words'], list)
        
        if len(data['words']) > 0:
            first_word = data['words'][0]
            expected_word_fields = ['id', 'nepali_word', 'english_word', 
                                  'romanized_nepali_word', 'part_of_speech']
            for field in expected_word_fields:
                assert field in first_word

    def test_group_words_empty(self, client, sample_groups):
        """Test group with no words"""
        group_id = sample_groups[0].id
        response = client.get(f'/api/groups/{group_id}/words')
        
        assert response.status_code == 200
        data = response.json['data']
        meta = response.json['meta']
        print("Data:", data)
        assert 'words' in data
        assert isinstance(data['words'], list)
        assert len(data['words']) == 0
        assert 'pagination' in meta

class TestStudyActivityEndpoints:
    """Test study activity endpoints"""
    def test_activity_crud(self, client, sample_groups, sample_activities):
        """Test complete CRUD operations for activities"""
        # List activities
        response = client.get('/api/study-activities')
        assert response.status_code == 200
        assert 'study_activities' in response.json['data']  # Changed from response.json
        
        activity = sample_activities[0]
        response = client.get(f'/api/study-activities/{activity.id}')
        assert response.status_code == 200
        data = response.json['data']
        assert data['name'] == activity.name

class TestStudySessionEndpoints:
    """Test study session endpoints"""
    def test_session_lifecycle(self, client, session, sample_study_session, sample_groups, sample_activities):
        """Test study session retrieval"""
        # Ensure relationships are set up
        sample_study_session.group = sample_groups[0]
        sample_study_session.activity = sample_activities[0]
        session.commit()

        # Test getting session details
        response = client.get(f'/api/study-sessions/{sample_study_session.id}')
        assert response.status_code == 200
        assert response.json['data']['id'] == sample_study_session.id
        assert 'group_name' in response.json['data']
        assert 'activity_name' in response.json['data']

    def test_session_list(self, client, sample_study_session):
        """Test session listing"""
        response = client.get('/api/study-sessions')
        print(f"Response status: {response.status_code}")  # Debug line
        print(f"Response data: {response.data}")          # Debug line
        print(f"Response text: {response.data.decode()}")
        assert response.status_code == 200
        response_data = response.json
        assert 'data' in response_data
        assert 'study_sessions' in response_data['data']
        assert isinstance(response_data['data']['study_sessions'], list)

class TestPaginationBehavior:
    """Test pagination across endpoints"""
    @pytest.mark.parametrize("endpoint", [
        '/api/words',
        '/api/groups',
        '/api/study-activities',
        '/api/study-sessions'
    ])
    def test_pagination_validation(self, client, endpoint):
        """Test pagination validation"""
        # Test valid pagination
        response = client.get(f'{endpoint}?page=1&per_page=10')
        assert response.status_code == 200
        
        # Test invalid cases
        invalid_params = [
            '?per_page=1000',  # Too large
            '?page=-1',        # Negative page
            '?page=abc',       # Invalid type
            '?per_page=0'      # Zero per_page
        ]
        
        for params in invalid_params:
            response = client.get(f'{endpoint}{params}')
            assert response.status_code == 400
            assert response.json['error_code'] == 'VALIDATION_ERROR'

class TestDataManagement:
    """Test data management endpoints"""
    def test_reset_operations(self, client, sample_word_reviews):
        """Test reset operations"""
        # Verify initial data exists
        response = client.get('/api/dashboard/statistics')
        assert response.status_code == 200
        initial_data = response.json['data']
        assert initial_data['words_learned'] > 0  # Fixed: incorrect path 'words_groups'
        
        # Test history reset
        response = client.post('/api/reset-history')
        assert response.status_code == 200
        assert response.json['success'] is True
        assert response.json['message'] == "History reset successfully"
        
        # Verify history reset
        response = client.get('/api/dashboard/statistics')
        assert response.status_code == 200
        assert response.json['data']['words_learned'] == 0
        
        # Test full reset
        response = client.post('/api/full-reset')
        assert response.status_code == 200
        assert response.json['success'] is True
        assert response.json['message'] == "Full reset successfully"
        
        # Verify complete reset
        response = client.get('/api/dashboard')
        assert response.status_code == 200
        dashboard_data = response.json['data']
        assert dashboard_data['total_words'] == 0
        assert dashboard_data['total_groups'] == 0
        assert dashboard_data['total_study_sessions'] == 0  # Added missing check