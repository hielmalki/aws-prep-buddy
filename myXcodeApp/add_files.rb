#!/usr/bin/env ruby
# Adds all new Swift/JSON files to the Xcode project
require 'xcodeproj'

project_path = File.expand_path('../myXcodeApp.xcodeproj', __FILE__)
project = Xcodeproj::Project.open(project_path)

main_target = project.targets.first
main_group = project.main_group.find_subpath('myXcodeApp', true)

# Files to remove (default boilerplate no longer used)
remove_files = ['Item.swift', 'ContentView.swift']
main_group.files.select { |f| remove_files.include?(f.display_name) }.each do |f|
  ref = main_target.source_build_phase.files_references.find { |r| r == f }
  main_target.source_build_phase.remove_file_reference(f) if ref
  f.remove_from_project
end

# Folder structure to add
folders = {
  'Models'   => ['ContentModels.swift', 'StorageModels.swift'],
  'Engine'   => ['QuizEngine.swift', 'SRSEngine.swift'],
  'Services' => ['ContentRepository.swift', 'StorageService.swift', 'TutorClient.swift'],
  'Stores'   => ['SettingsStore.swift', 'StreakStore.swift', 'ProgressStore.swift',
                  'FlashcardStore.swift', 'QuizStore.swift', 'TutorStore.swift'],
  'Screens'  => ['HomeView.swift', 'ExamListView.swift', 'QuizView.swift', 'ResultView.swift',
                  'ReviewView.swift', 'LearnIndexView.swift', 'LearnModuleView.swift',
                  'FlashcardsView.swift', 'FlashcardReviewView.swift', 'SettingsView.swift'],
  'Sheets'   => ['TutorSheet.swift'],
  'Resources'=> ['exams.json', 'sections.json'],
}

base_path = File.expand_path('myXcodeApp', File.dirname(project_path))

folders.each do |folder_name, files|
  group = main_group.find_subpath(folder_name, true)
  group.set_source_tree('<group>')
  group.set_path(folder_name)

  files.each do |filename|
    file_path = File.join(base_path, folder_name, filename)
    next unless File.exist?(file_path)

    existing = group.files.find { |f| f.display_name == filename }
    next if existing

    file_ref = group.new_reference(file_path)
    file_ref.set_source_tree('<group>')
    file_ref.set_last_known_file_type(
      filename.end_with?('.json') ? 'text.json' : 'sourcecode.swift'
    )

    if filename.end_with?('.swift')
      main_target.source_build_phase.add_file_reference(file_ref)
    else
      # JSON → Resources build phase
      resources_phase = main_target.resources_build_phase
      resources_phase.add_file_reference(file_ref) unless
        resources_phase.files_references.include?(file_ref)
    end

    puts "  Added: #{folder_name}/#{filename}"
  end
end

# Add AppRoot.swift to main group
['AppRoot.swift'].each do |filename|
  file_path = File.join(base_path, filename)
  next unless File.exist?(file_path)
  existing = main_group.files.find { |f| f.display_name == filename }
  next if existing
  file_ref = main_group.new_reference(file_path)
  file_ref.set_source_tree('<group>')
  main_target.source_build_phase.add_file_reference(file_ref)
  puts "  Added: #{filename}"
end

project.save
puts "\nDone! Project saved."
